const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');
const { ISOToLocal } = require('../../function/formatDateTime');

router.get('/02EXPORTALERT/TEST', async (req, res) => {
    return res.json("SARKPI V0.1");
});

router.post('/02EXPORTALERT/Login', async (req, res) => {
    //-------------------------------------
    // console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    let query = `SELECT  *  FROM [Export_Alert].[dbo].[master_user] WHERE [user_name] LIKE '${input['user_name']}'`;
    let findDB = await mssql.qurey(query);
    try {
        if (findDB['recordsets'].length > 0) {
            // console.log(findDB['recordsets']);
            if (findDB['recordsets'][0][0]['password'] === input['password']) {
                output = {
                    "user_name": findDB['recordsets'][0][0]['user_name'],
                    "name": findDB['recordsets'][0][0]['name'],
                    "section": findDB['recordsets'][0][0]['section'],
                    "roleid": findDB['recordsets'][0][0]['roleid'] || '1',
                    "branch": findDB['recordsets'][0][0]['branch'],
                    "permission": findDB['recordsets'][0][0]['permission'],
                    "return": 'OK'
                }
            } else {
                output = { "return": 'PASSWORD INCORRECT' }
            }

        }
    } catch {

    }
    return res.json(output);
});

router.post('/02EXPORTALERT/getDataTable', async (req, res) => {
    //-------------------------------------
    console.log("--getDataTable--");
    //-------------------------------------
    let output = [];
    let query = `WITH R AS (
    SELECT  *,
            ROW_NUMBER() OVER (PARTITION BY po_no ORDER BY user_input_date DESC) AS rn
    FROM [Export_Alert].[dbo].[data_table])
    SELECT TOP 10000 *
    FROM R
    WHERE rn = 1
    ORDER BY user_input_date DESC;`;
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata: " + buffer.length);
        // console.log(buffer);
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูลในตาราง');
    }
    //-------------------------------------
});

router.post('/02EXPORTALERT/getDropdown', async (req, res) => {
    try {
        //-------------------------------------
        console.log("--getDropdown--");
        //-------------------------------------
        let query = `SELECT * From [Export_Alert].[dbo].[master_material];`;
        let db = await mssql.qurey(query);

        if (db["recordsets"].length > 0) {
            let buffer = db["recordsets"][0];
            let custshortArr = buffer
                .filter(row => row.custshort && row.custshort.trim() !== "" && row.customer_id)
                .map(row => `${row.custfull} || ${row.custshort} || ${row.customer_id}`);

            let custshort = [...new Set(custshortArr)]; // distinct

            // mat_description | mat_no
            let materialArr = buffer
                .filter(row => row.mat_description && row.mat_description.trim() !== "" && row.mat_no)
                .map(row => `${row.mat_description} || ${row.mat_no} || ${row.mat_lead_time}`);

            let material = [...new Set(materialArr)]; // distinct

            let output = {
                custshort,
                material
            };

            return res.status(200).json(output);
        } else {
            return res.status(400).json('ไม่พบข้อมูล');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.post('/02EXPORTALERT/addNewPO', async (req, res) => {
    try {
        //-------------------------------------
        console.log("--addNewPO--");
        //-------------------------------------
        // console.log(req.body);
        let dataRow = req.body.data;
        let insertQuery = '';
        const now = ISOToLocal(new Date());

        for (const data of dataRow) {
            let fields = [];
            function pushField(name, value) {
                if (value !== '') {
                    const escapedValue = value.toString().replace(/'/g, "''");
                    fields.push(`[${name}] = '${escapedValue}'`);
                } else {
                    fields.push(`[${name}] = NULL`);
                }
            }

            pushField("po_no", data.po_no);
            pushField("customer_id", data.customer_id);
            pushField("custfull", data.custfull);
            pushField("custshort", data.custshort);
            pushField("mat_no", data.mat_no);
            pushField("mat_description", data.mat_description);
            pushField("mat_type", data.mat_type);
            pushField("mat_lead_time", data.mat_lead_time);
            pushField("quantity", data.quantity);
            pushField("uom", data.uom);
            pushField("eta", formatDateToSQL(data.eta));
            pushField("shipment_type", data.shipment_type);
            pushField("receive_po_date", formatDateToSQL(data.receive_po_date));
            pushField("sale_order", formatDateToSQL(data.sale_order));
            pushField("proforma", formatDateToSQL(data.proforma));
            pushField("book_shipment", formatDateToSQL(data.book_shipment));
            pushField("receive_booking", formatDateToSQL(data.receive_booking));
            pushField("acknowledgement", formatDateToSQL(data.acknowledgement));
            pushField("delivery_order", formatDateToSQL(data.delivery_order));
            pushField("loading_sheet", formatDateToSQL(data.loading_sheet));
            pushField("confirm_export_entry", formatDateToSQL(data.confirm_export_entry));
            pushField("loading_date", formatDateToSQL(data.loading_date));
            pushField("confirm_bill", formatDateToSQL(data.confirm_bill));
            pushField("etd", formatDateToSQL(data.etd));
            pushField("confirm_insurance", formatDateToSQL(data.confirm_insurance));
            pushField("post_and_qc", formatDateToSQL(data.post_and_qc));
            pushField("send_document", formatDateToSQL(data.send_document));
            pushField("issue_invoice", formatDateToSQL(data.issue_invoice));
            pushField("receive_shipping", formatDateToSQL(data.receive_shipping));
            pushField("status", 'Receive PO');
            pushField("status_date", now);
            pushField("status_due", formatDateToSQL(data.status_due));
            pushField("final_due", formatDateToSQL(data.final_due));
            pushField("user_input", data.user_input);
            pushField("user_input_date", now);

            // AllFields.push(`(${fields.join(', ')})`);

            // INSERT
            let insert = `
            INSERT INTO [Export_Alert].[dbo].[data_table] (
            ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
            )
            VALUES (
            ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
            )
            `;
            insertQuery += insert + '\n';
        }
        // console.log(insertQuery);
        let insertResult = await mssql.qurey(insertQuery);

        if (insertResult["rowsAffected"][0] > 0) {
            console.log("Insert Success");
            return res.status(200).json({ message: 'Add new PO success' });
        } else {
            console.log("Insert Failed");
            return res.status(400).json('Add new PO failed');
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Server Error", error: err.message });
    }
});

router.post('/02EXPORTALERT/nextPlan', async (req, res) => {
    //-------------------------------------
    console.log("--nextPlan--");
    //-------------------------------------
    let dataRow = req.body.data;
    // console.log(dataRow);
    const now = ISOToLocal(new Date());

    let fields = [];
    function pushField(name, value) {
        if (value !== '') {
            fields.push(`[${name}] = '${value}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("status", dataRow.status);
    pushField("status_date", now);
    pushField("status_due", formatDateToSQL2(dataRow.status_due));

    let query = `
        UPDATE [Export_Alert].[dbo].[data_table]
        SET ${fields.join(',\n')}
        WHERE po_no = '${dataRow.po_no}'
        `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Update Success");
        return res.status(200).json({ message: 'Next Plan success' });
    } else {
        console.log("Update Failed");
        return res.status(400).json('อัปเดทข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02EXPORTALERT/updateN2', async (req, res) => {
    //-------------------------------------
    console.log("--updateN2--");
    //-------------------------------------
    let dataRow = req.body.data;
    // console.log(dataRow);
    const now = ISOToLocal(new Date());

    let fields = [];
    function pushField(name, value) {
        if (value !== '') {
            fields.push(`[${name}] = '${value}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("receive_booking", formatDateToSQL2(dataRow.receive_booking));
    pushField("acknowledgement", formatDateToSQL2(dataRow.acknowledgement));
    pushField("delivery_order", formatDateToSQL2(dataRow.delivery_order));
    pushField("loading_sheet", formatDateToSQL2(dataRow.loading_sheet));
    pushField("confirm_export_entry", formatDateToSQL2(dataRow.confirm_export_entry));
    pushField("loading_date", formatDateToSQL2(dataRow.loading_date));
    pushField("confirm_bill", formatDateToSQL2(dataRow.confirm_bill));
    pushField("etd", formatDateToSQL2(dataRow.etd));
    pushField("confirm_insurance", formatDateToSQL2(dataRow.confirm_insurance));
    pushField("post_and_qc", formatDateToSQL2(dataRow.post_and_qc));
    pushField("send_document", formatDateToSQL2(dataRow.send_document));
    pushField("issue_invoice", formatDateToSQL2(dataRow.issue_invoice));
    pushField("receive_shipping", formatDateToSQL2(dataRow.receive_shipping));
    pushField("status", dataRow.status);
    pushField("status_date", now);
    pushField("status_due", formatDateToSQL2(dataRow.status_due));

    let query = `
        UPDATE [Export_Alert].[dbo].[data_table]
        SET ${fields.join(',\n')}
        WHERE po_no = '${dataRow.po_no}'
        `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Update Success");
        return res.status(200).json({ message: 'Next Plan success' });
    } else {
        console.log("Update Failed");
        return res.status(400).json('อัปเดทข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02EXPORTALERT/updateEdit', async (req, res) => {
    //-------------------------------------
    console.log("--updateEdit--");
    //-------------------------------------
    let dataRow = req.body.data;
    // console.log(dataRow);
    // console.log(req.body.stepAction);
    const now = ISOToLocal(new Date());

    let fields = [];
    function pushField(name, value) {
        if (name.startsWith('user_edit_')) {
            if (value === '' || value === null || value === undefined) {
                fields.push(`[${name}] = '${now}'`);
            } else {
                fields.push(`[${name}] = '${value}'`);
            }
        }
        else {
            if (value !== '' && value !== null && value !== undefined) {
                fields.push(`[${name}] = '${value}'`);
            } else {
                fields.push(`[${name}] = NULL`);
            }
        }
    }

    pushField("receive_booking", formatDateToSQL2(dataRow.receive_booking));
    pushField("acknowledgement", formatDateToSQL2(dataRow.acknowledgement));
    pushField("delivery_order", formatDateToSQL2(dataRow.delivery_order));
    pushField("loading_sheet", formatDateToSQL2(dataRow.loading_sheet));
    pushField("confirm_export_entry", formatDateToSQL2(dataRow.confirm_export_entry));
    pushField("loading_date", formatDateToSQL2(dataRow.loading_date));
    pushField("confirm_bill", formatDateToSQL2(dataRow.confirm_bill));
    pushField("etd", formatDateToSQL2(dataRow.etd));
    pushField("confirm_insurance", formatDateToSQL2(dataRow.confirm_insurance));
    pushField("post_and_qc", formatDateToSQL2(dataRow.post_and_qc));
    pushField("send_document", formatDateToSQL2(dataRow.send_document));
    pushField("issue_invoice", formatDateToSQL2(dataRow.issue_invoice));
    pushField("receive_shipping", formatDateToSQL2(dataRow.receive_shipping));
    if (req.body.stepAction.includes('Receive Booking')) {
        if (dataRow.receive_booking1 !== '') {
            pushField("receive_booking1", formatDateToSQL2(dataRow.receive_booking1));
            pushField("user_edit_booking1", dataRow.user_edit_booking1);
            pushField("user_edit_booking_date1", formatDateTimeToSQL(dataRow.user_edit_booking_date1));
        }
        if (dataRow.receive_booking2 !== '') {
            pushField("receive_booking2", formatDateToSQL2(dataRow.receive_booking2));
            pushField("user_edit_booking2", dataRow.user_edit_booking2);
            pushField("user_edit_booking_date2", formatDateTimeToSQL(dataRow.user_edit_booking_date2));
        }
        if (dataRow.receive_booking3 !== '') {
            pushField("receive_booking3", formatDateToSQL2(dataRow.receive_booking3));
            pushField("user_edit_booking3", dataRow.user_edit_booking3);
            pushField("user_edit_booking_date3", formatDateTimeToSQL(dataRow.user_edit_booking_date3));
        }
    }
    if (req.body.stepAction.includes('ETD')) {
        // console.log("ETD Edit");
        if (dataRow.etd1 !== '') {
            pushField("etd1", formatDateToSQL2(dataRow.etd1));
            pushField("user_edit_etd1", dataRow.user_edit_etd1);
            pushField("user_edit_etd_date1", formatDateTimeToSQL(dataRow.user_edit_etd_date1));
        }
        if (dataRow.etd2 !== '') {
            pushField("etd2", formatDateToSQL2(dataRow.etd2));
            pushField("user_edit_etd2", dataRow.user_edit_etd2);
            pushField("user_edit_etd_date2", formatDateTimeToSQL(dataRow.user_edit_etd_date2));
        }
        if (dataRow.etd3 !== '') {
            pushField("etd3", formatDateToSQL2(dataRow.etd3));
            pushField("user_edit_etd3", dataRow.user_edit_etd3);
            pushField("user_edit_etd_date3", formatDateTimeToSQL(dataRow.user_edit_etd_date3));
        }
    }

    let query = `
        UPDATE [Export_Alert].[dbo].[data_table]
        SET ${fields.join(',\n')}
        WHERE po_no = '${dataRow.po_no}'
        `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Update Success");
        return res.status(200).json({ message: 'Edit success' });
    } else {
        console.log("Update Failed");
        return res.status(400).json('อัปเดทข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02EXPORTALERT/CheckOldPassword', async (req, res) => {
    //-------------------------------------
    console.log("--CheckOldPassword--");
    //-------------------------------------
    // console.log(req.body);
    let query = `SELECT * From [Export_Alert].[dbo].[master_user] WHERE user_name = '${req.body.UserName}' 
                AND password = '${req.body.OldPassword}'`;
    let db = await mssql.qurey(query);
    // console.log(query);
    // console.log(db);
    if (db["recordset"].length > 0) {
        // console.log('200');
        return res.status(200).json();
    } else {
        // console.log('400');
        return res.status(400).json('Old Password ไม่ถูกต้อง');
    }
    //-------------------------------------

});

router.post('/02EXPORTALERT/UpdatePassword', async (req, res) => {
    //-------------------------------------
    console.log("--UpdatePassword--");
    //-------------------------------------
    let query = `
        UPDATE [Export_Alert].[dbo].[master_user]
        SET password = '${req.body.NewPassword}'
        WHERE user_name = '${req.body.UserName}'
        `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Update Success");
        return res.status(200).json('อัปเดทข้อมูลสำเร็จ');
        // return res.status(400).json('อัปเดทข้อมูลสำเร็จ');
    } else {
        console.log("Update Failed");
        return res.status(400).json('อัปเดทข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

function formatDateToSQL(d) {
    if (!d) {
        return '';
    }
    const [day, month, year] = d.split("-");
    return `${year}-${month}-${day}`;
}

function formatDateToSQL2(d) {
    if (!d) {
        return '';
    }
    const [day, month, year] = d.split("-");
    return `${20 + year}-${month}-${day}`;
}

function formatDateTimeToSQL(d) {
    if (!d) {
        return '';
    }
    const [datePart, timePart] = d.split(' ');

    const [day, month, year] = datePart.split('-').map(Number);

    const fullYear = year + 2000;

    return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${timePart}`;
}

module.exports = router;