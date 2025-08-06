const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');

router.get('/02SARKPI/TEST', async (req, res) => {
    // console.log(mssql.qurey())
    return res.json("SARKPI V0.1");
});

router.post('/02SALTSPRAY/Login', async (req, res) => {
    //-------------------------------------
    // console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    let query = `SELECT  *  FROM [SALTSPRAY].[dbo].[Master_User] WHERE [UserName] LIKE '${input['UserName']}'`;
    let findDB = await mssql.qurey(query);
    try {
        if (findDB['recordsets'].length > 0) {
            // console.log(findDB['recordsets']);
            if (findDB['recordsets'][0][0]['Password'] === input['Password']) {
                output = {
                    "UserName": findDB['recordsets'][0][0]['UserName'],
                    "NAME": findDB['recordsets'][0][0]['Name'],
                    "Section": findDB['recordsets'][0][0]['Section'],
                    "Roleid": findDB['recordsets'][0][0]['Roleid'] || '1',
                    "Branch": findDB['recordsets'][0][0]['Branch'],
                    "Permission": findDB['recordsets'][0][0]['Permission'],
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

router.post('/02SALTSPRAY/DataTable', async (req, res) => {
    //-------------------------------------
    console.log("--DataTable--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[DataTable] 
    WHERE Status IN ('RECEIVED', 'START', 'WAIT TRANSFER', 'PM') 
    ORDER BY Request_No, Status, Instrument`;
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

router.post('/02SALTSPRAY/DataforTableStatus', async (req, res) => {
    //-------------------------------------
    console.log("--DataforTableStatus--");
    //-------------------------------------
    let output = [];
    let query = `SELECT TOP 100 * From [SALTSPRAY].[dbo].[DataTable] 
    ORDER BY Request_No, Status, Instrument`;
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

router.post('/02SALTSPRAY/CalendarInMonth', async (req, res) => {
    console.log("--CalendarInMonth--");

    let year = parseInt(req.body.year);
    let month = parseInt(req.body.month);

    let query = `
        SELECT * 
        FROM [SALTSPRAY].[dbo].[DataTable]
        WHERE 
            Status IN ('RECEIVED', 'START', 'FINISH', 'PM') AND
        (
        (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date1) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date1)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date1) = ${year} AND ${month} <= MONTH(Finish_Date1))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date1) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date1) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date2) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date2)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date2) = ${year} AND ${month} <= MONTH(Finish_Date2))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date2) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date2) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date3) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date3)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date3) = ${year} AND ${month} <= MONTH(Finish_Date3))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date3) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date3) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date4) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date4)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date4) = ${year} AND ${month} <= MONTH(Finish_Date4))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date4) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date4) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date5) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date5)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date5) = ${year} AND ${month} <= MONTH(Finish_Date5))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date5) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date5) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date6) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date6)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date6) = ${year} AND ${month} <= MONTH(Finish_Date6))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date6) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date6) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date7) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date7)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date7) = ${year} AND ${month} <= MONTH(Finish_Date7))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date7) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date7) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date8) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date8)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date8) = ${year} AND ${month} <= MONTH(Finish_Date8))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date8) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date8) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date9) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date9)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date9) = ${year} AND ${month} <= MONTH(Finish_Date9))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date9) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date9) > ${year})
        )
        OR (
            (
                YEAR(Start_Date) = ${year} AND YEAR(Finish_Date10) = ${year} AND ${month} BETWEEN MONTH(Start_Date) AND MONTH(Finish_Date10)
            )
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date10) = ${year} AND ${month} <= MONTH(Finish_Date10))
            OR (YEAR(Start_Date) = ${year} AND YEAR(Finish_Date10) > ${year} AND ${month} >= MONTH(Start_Date))
            OR (YEAR(Start_Date) < ${year} AND YEAR(Finish_Date10) > ${year})
        )
    ) order by Request_No;
    `;
    // console.log(query);
    try {
        let db = await mssql.qurey(query);

        if (db["recordsets"].length > 0) {
            let buffer = db["recordsets"][0];
            // console.log(buffer);
            return res.status(200).json(buffer);
        } else {
            return res.status(400).json('ไม่พบข้อมูลในตาราง');
        }
    } catch (error) {
        console.error("SQL Error:", error);
        return res.status(500).json("เกิดข้อผิดพลาดในเซิร์ฟเวอร์");
    }
});



router.post('/02SALTSPRAY/InstrumentStatus', async (req, res) => {
    //-------------------------------------
    console.log("--InstrumentStatus--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[Instrument_Status] order by Instrument`;
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata2: " + buffer.length);
        // console.log(buffer);
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูลสถานะ');
    }
    //-------------------------------------
});

router.post('/02SALTSPRAY/EditInstrumentStatus', async (req, res) => {
    //-------------------------------------
    console.log("--EditInstrumentStatus--");
    //-------------------------------------
    // console.log(req.body.Status);
    // console.log(req.body.Instrument);
    let output = [];
    let query = `UPDATE [SALTSPRAY].[dbo].[Instrument_Status]
        SET Status = '${req.body.Status}'
        WHERE Instrument = '${req.body.Instrument}'`;
    let db = await mssql.qurey(query);
    // console.log(query);
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

router.post('/02SALTSPRAY/EditStatusJob', async (req, res) => {
    //-------------------------------------
    console.log("--EditStatusJob--");
    //-------------------------------------
    // console.log(req.body.Status);
    // console.log(req.body.Instrument);
    let output = [];
    let query = `UPDATE [SALTSPRAY].[dbo].[DataTable]
        SET Status = '${req.body.Status}'
        WHERE Instrument = '${req.body.Instrument}' and Status != 'TRANSFER' and Status != 'FINISH' and Status != 'PM'`;
    let db = await mssql.qurey(query);
    // console.log(query);
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

router.post('/02SALTSPRAY/TranferInstrument', async (req, res) => {
    console.log("--TranferInstrument--");

    try {
        let dataRow = JSON.parse(req.body.dataRow);
        // console.log(dataRow.REQUESTNO);

        // STEP 1: UPDATE
        let updateQuery = `
            UPDATE [SALTSPRAY].[dbo].[DataTable]
            SET Status = 'TRANSFER'
            WHERE Request_No = '${dataRow.REQUESTNO}' and Status = '${dataRow.STATUS}'`;
        let updateResult = await mssql.qurey(updateQuery);
        // console.log(updateQuery);

        if (updateResult["rowsAffected"][0] > 0) {
            console.log("Update Success");

            // STEP 2: CREATE INSERT QUERY
            let fields = [];

            // function pushField(name, value) {
            //     if (value !== '' && value !== null && value !== 'null') {
            //         fields.push(`[${name}] = '${value}'`);
            //     }
            // }

            function pushField(name, value) {
                if (value !== '' && value !== null && value !== 'null') {
                    const escapedValue = value.toString().replace(/'/g, "''");
                    fields.push(`[${name}] = N'${escapedValue}'`);
                }
            }

            // --- Push fields here ---
            pushField("Type", dataRow.TYPE);
            pushField("Request_No", dataRow.REQUESTNO);
            pushField("Report_No", dataRow.REPORTNO);
            pushField("Section", dataRow.SECTION);
            pushField("Requester", dataRow.REQUESTER);
            pushField("Sampling_Date", dataRow.SAMPLINGDATE);
            pushField("Received_Date", dataRow.RECEIVEDDATE);
            pushField("Customer_Name", dataRow.CUSTOMERNAME);
            pushField("Part_Name1", dataRow.PARTNAME1);
            pushField("Part_No1", dataRow.PARTNO1);
            pushField("Lot_No1", dataRow.LOTNO1);
            pushField("Amount1", dataRow.AMOUNT1);
            pushField("Material1", dataRow.MATERIAL1);
            pushField("Process1", dataRow.PROCESS1);
            pushField("Part_Name2", dataRow.PARTNAME2);
            pushField("Part_No2", dataRow.PARTNO2);
            pushField("Lot_No2", dataRow.LOTNO2);
            pushField("Amount2", dataRow.AMOUNT2);
            pushField("Material2", dataRow.MATERIAL2);
            pushField("Process2", dataRow.PROCESS2);
            pushField("Part_Name3", dataRow.PARTNAME3);
            pushField("Part_No3", dataRow.PARTNO3);
            pushField("Lot_No3", dataRow.LOTNO3);
            pushField("Amount3", dataRow.AMOUNT3);
            pushField("Material3", dataRow.MATERIAL3);
            pushField("Process3", dataRow.PROCESS3);
            pushField("Part_Name4", dataRow.PARTNAME4);
            pushField("Part_No4", dataRow.PARTNO4);
            pushField("Lot_No4", dataRow.LOTNO4);
            pushField("Amount4", dataRow.AMOUNT4);
            pushField("Material4", dataRow.MATERIAL4);
            pushField("Process4", dataRow.PROCESS4);
            pushField("Part_Name5", dataRow.PARTNAME5);
            pushField("Part_No5", dataRow.PARTNO5);
            pushField("Lot_No5", dataRow.LOTNO5);
            pushField("Amount5", dataRow.AMOUNT5);
            pushField("Material5", dataRow.MATERIAL5);
            pushField("Process5", dataRow.PROCESS5);
            pushField("Part_Name6", dataRow.PARTNAME6);
            pushField("Part_No6", dataRow.PARTNO6);
            pushField("Lot_No6", dataRow.LOTNO6);
            pushField("Amount6", dataRow.AMOUNT6);
            pushField("Material6", dataRow.MATERIAL6);
            pushField("Process6", dataRow.PROCESS6);
            pushField("Part_Name7", dataRow.PARTNAME7);
            pushField("Part_No7", dataRow.PARTNO7);
            pushField("Lot_No7", dataRow.LOTNO7);
            pushField("Amount7", dataRow.AMOUNT7);
            pushField("Material7", dataRow.MATERIAL7);
            pushField("Process7", dataRow.PROCESS7);
            pushField("Part_Name8", dataRow.PARTNAME8);
            pushField("Part_No8", dataRow.PARTNO8);
            pushField("Lot_No8", dataRow.LOTNO8);
            pushField("Amount8", dataRow.AMOUNT8);
            pushField("Material8", dataRow.MATERIAL8);
            pushField("Process8", dataRow.PROCESS8);
            pushField("Part_Name9", dataRow.PARTNAME9);
            pushField("Part_No9", dataRow.PARTNO9);
            pushField("Lot_No9", dataRow.LOTNO9);
            pushField("Amount9", dataRow.AMOUNT9);
            pushField("Material9", dataRow.MATERIAL9);
            pushField("Process9", dataRow.PROCESS9);
            pushField("Part_Name10", dataRow.PARTNAME10);
            pushField("Part_No10", dataRow.PARTNO10);
            pushField("Lot_No10", dataRow.LOTNO10);
            pushField("Amount10", dataRow.AMOUNT10);
            pushField("Material10", dataRow.MATERIAL10);
            pushField("Process10", dataRow.PROCESS10);
            // pushField("Amount_Sample", dataRow.AMOUNTSAMPLE);
            pushField("Take_Photo", dataRow.TAKEPHOTO);
            pushField("Start_Date", dataRow.STARTDATE);
            pushField("Time1", dataRow.TIME1);
            pushField("Finish_Date1", dataRow.FINISHDATE1);
            pushField("Temp_Date1", dataRow.TEMPDATE1);
            pushField("Due_Date1", dataRow.DUEDATE1);
            pushField("Time2", dataRow.TIME2);
            pushField("Finish_Date2", dataRow.FINISHDATE2);
            pushField("Temp_Date2", dataRow.TEMPDATE2);
            pushField("Due_Date2", dataRow.DUEDATE2);
            pushField("Time3", dataRow.TIME3);
            pushField("Finish_Date3", dataRow.FINISHDATE3);
            pushField("Temp_Date3", dataRow.TEMPDATE3);
            pushField("Due_Date3", dataRow.DUEDATE3);
            pushField("Time4", dataRow.TIME4);
            pushField("Finish_Date4", dataRow.FINISHDATE4);
            pushField("Temp_Date4", dataRow.TEMPDATE4);
            pushField("Due_Date4", dataRow.DUEDATE4);
            pushField("Time5", dataRow.TIME5);
            pushField("Finish_Date5", dataRow.FINISHDATE5);
            pushField("Temp_Date5", dataRow.TEMPDATE5);
            pushField("Due_Date5", dataRow.DUEDATE5);
            pushField("Time6", dataRow.TIME6);
            pushField("Finish_Date6", dataRow.FINISHDATE6);
            pushField("Temp_Date6", dataRow.TEMPDATE6);
            pushField("Due_Date6", dataRow.DUEDATE6);
            pushField("Time7", dataRow.TIME7);
            pushField("Finish_Date7", dataRow.FINISHDATE7);
            pushField("Temp_Date7", dataRow.TEMPDATE7);
            pushField("Due_Date7", dataRow.DUEDATE7);
            pushField("Time8", dataRow.TIME8);
            pushField("Finish_Date8", dataRow.FINISHDATE8);
            pushField("Temp_Date8", dataRow.TEMPDATE8);
            pushField("Due_Date8", dataRow.DUEDATE8);
            pushField("Time9", dataRow.TIME9);
            pushField("Finish_Date9", dataRow.FINISHDATE9);
            pushField("Temp_Date9", dataRow.TEMPDATE9);
            pushField("Due_Date9", dataRow.DUEDATE9);
            pushField("Time10", dataRow.TIME10);
            pushField("Finish_Date10", dataRow.FINISHDATE10);
            pushField("Temp_Date10", dataRow.TEMPDATE10);
            pushField("Due_Date10", dataRow.DUEDATE10);
            pushField("Temp_Date0", dataRow.TEMPDATE0);
            pushField("Due_Date0", dataRow.DUEDATE0);
            pushField("Instrument", dataRow.INSTRUMENT);
            pushField("Method", dataRow.METHOD);
            pushField("Incharge", dataRow.INCHARGE);
            pushField("Approved_Date", dataRow.APPROVEDDATE);
            pushField("Approved_By", dataRow.APPROVEDBY);
            pushField("Status", 'RECEIVED');
            pushField("Remark", dataRow.REMARK);
            pushField("CheckBox", dataRow.CHECKBOX);

            // INSERT
            let insertQuery = `
                INSERT INTO [SALTSPRAY].[dbo].[DataTable] (
                    ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
                )
                VALUES (
                    ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
                )
            `;

            // console.log(insertQuery);
            let insertResult = await mssql.qurey(insertQuery);

            if (insertResult["rowsAffected"][0] > 0) {
                console.log("Insert Success");
                return res.status(200).json('อัปเดทและเพิ่มข้อมูลสำเร็จ');
            } else {
                console.log("Insert Failed");
                return res.status(400).json('Insert ไม่สำเร็จ');
            }

        } else {
            console.log("Update Failed");
            return res.status(400).json('อัปเดทไม่สำเร็จ');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json('เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์');
    }
});

router.post('/02SALTSPRAY/SearchCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--SearchCustomer--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[Customer]`
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata: " + buffer.length);
        output = buffer;
        // console.log(output);
        return res.status(200).json(output);
        // return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    } else {
        return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/SearchRequester', async (req, res) => {
    //-------------------------------------
    console.log("--SearchRequester--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[Requester]`
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata: " + buffer.length);
        output = buffer;
        // console.log(output);
        return res.status(200).json(output);
        // return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    } else {
        return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/SearchIncharge', async (req, res) => {
    //-------------------------------------
    console.log("--SearchIncharge--");
    //-------------------------------------
    let output = [];
    let query = `SELECT Id, Name, Email, Section, Branch, Roleid From [SALTSPRAY].[dbo].[Master_User] order by Name`
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata: " + buffer.length);
        output = buffer;
        // console.log(output);
        return res.status(200).json(output);
        // return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    } else {
        return res.status(400).json('ไม่พบข้อมูลผู้รับผิดชอบ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/CheckOldPassword', async (req, res) => {
    //-------------------------------------
    console.log("--CheckOldPassword--");
    //-------------------------------------
    // console.log(req.body);
    let query = `SELECT * From [SALTSPRAY].[dbo].[Master_User] WHERE UserName = '${req.body.UserName}' 
                AND Password = '${req.body.OldPassword}'`;
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

router.post('/02SALTSPRAY/UpdatePassword', async (req, res) => {
    //-------------------------------------
    console.log("--UpdatePassword--");
    //-------------------------------------
    let query = `
        UPDATE [SALTSPRAY].[dbo].[Master_User]
        SET Password = '${req.body.NewPassword}'
        WHERE UserName = '${req.body.UserName}'
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

// router.post("/soi8/compareSCADA", async (req, res) => {
//     console.log("/soi8/compareSCADA", JSON.parse(req.body.dataOrder));
//     let dataOrder = JSON.parse(req.body.dataOrder);
//     let output = await setupWeightData(dataOrder);
//     if (output.message == undefined) {
//         return res.status(200).json(output);
//     } else {
//         console.log(output.message);
//         return res.status(400).json(output.message);
//     }
// });

router.post('/02SALTSPRAY/EditData', async (req, res) => {
    //-------------------------------------
    console.log("--EditData--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Type", dataRow.TYPE);
    pushField("Request_No", dataRow.REQUESTNO);
    pushField("Report_No", dataRow.REPORTNO);
    pushField("Section", dataRow.SECTION);
    pushField("Requester", dataRow.REQUESTER);
    pushField("Sampling_Date", dataRow.SAMPLINGDATE);
    pushField("Received_Date", dataRow.RECEIVEDDATE);
    pushField("Customer_Name", dataRow.CUSTOMERNAME);
    pushField("Part_Name1", dataRow.PARTNAME1);
    pushField("Part_No1", dataRow.PARTNO1);
    pushField("Lot_No1", dataRow.LOTNO1);
    pushField("Amount1", dataRow.AMOUNT1);
    pushField("Material1", dataRow.MATERIAL1);
    pushField("Process1", dataRow.PROCESS1);
    pushField("Part_Name2", dataRow.PARTNAME2);
    pushField("Part_No2", dataRow.PARTNO2);
    pushField("Lot_No2", dataRow.LOTNO2);
    pushField("Amount2", dataRow.AMOUNT2);
    pushField("Material2", dataRow.MATERIAL2);
    pushField("Process2", dataRow.PROCESS2);
    pushField("Part_Name3", dataRow.PARTNAME3);
    pushField("Part_No3", dataRow.PARTNO3);
    pushField("Lot_No3", dataRow.LOTNO3);
    pushField("Amount3", dataRow.AMOUNT3);
    pushField("Material3", dataRow.MATERIAL3);
    pushField("Process3", dataRow.PROCESS3);
    pushField("Part_Name4", dataRow.PARTNAME4);
    pushField("Part_No4", dataRow.PARTNO4);
    pushField("Lot_No4", dataRow.LOTNO4);
    pushField("Amount4", dataRow.AMOUNT4);
    pushField("Material4", dataRow.MATERIAL4);
    pushField("Process4", dataRow.PROCESS4);
    pushField("Part_Name5", dataRow.PARTNAME5);
    pushField("Part_No5", dataRow.PARTNO5);
    pushField("Lot_No5", dataRow.LOTNO5);
    pushField("Amount5", dataRow.AMOUNT5);
    pushField("Material5", dataRow.MATERIAL5);
    pushField("Process5", dataRow.PROCESS5);
    pushField("Part_Name6", dataRow.PARTNAME6);
    pushField("Part_No6", dataRow.PARTNO6);
    pushField("Lot_No6", dataRow.LOTNO6);
    pushField("Amount6", dataRow.AMOUNT6);
    pushField("Material6", dataRow.MATERIAL6);
    pushField("Process6", dataRow.PROCESS6);
    pushField("Part_Name7", dataRow.PARTNAME7);
    pushField("Part_No7", dataRow.PARTNO7);
    pushField("Lot_No7", dataRow.LOTNO7);
    pushField("Amount7", dataRow.AMOUNT7);
    pushField("Material7", dataRow.MATERIAL7);
    pushField("Process7", dataRow.PROCESS7);
    pushField("Part_Name8", dataRow.PARTNAME8);
    pushField("Part_No8", dataRow.PARTNO8);
    pushField("Lot_No8", dataRow.LOTNO8);
    pushField("Amount8", dataRow.AMOUNT8);
    pushField("Material8", dataRow.MATERIAL8);
    pushField("Process8", dataRow.PROCESS8);
    pushField("Part_Name9", dataRow.PARTNAME9);
    pushField("Part_No9", dataRow.PARTNO9);
    pushField("Lot_No9", dataRow.LOTNO9);
    pushField("Amount9", dataRow.AMOUNT9);
    pushField("Material9", dataRow.MATERIAL9);
    pushField("Process9", dataRow.PROCESS9);
    pushField("Part_Name10", dataRow.PARTNAME10);
    pushField("Part_No10", dataRow.PARTNO10);
    pushField("Lot_No10", dataRow.LOTNO10);
    pushField("Amount10", dataRow.AMOUNT10);
    pushField("Material10", dataRow.MATERIAL10);
    pushField("Process10", dataRow.PROCESS10);
    // pushField("Amount_Sample", dataRow.AMOUNTSAMPLE);
    pushField("Take_Photo", dataRow.TAKEPHOTO);
    pushField("Start_Date", dataRow.STARTDATE);
    pushField("Time1", dataRow.TIME1);
    pushField("Finish_Date1", dataRow.FINISHDATE1);
    pushField("Temp_Date1", dataRow.TEMPDATE1);
    pushField("Due_Date1", dataRow.DUEDATE1);
    pushField("Time2", dataRow.TIME2);
    pushField("Finish_Date2", dataRow.FINISHDATE2);
    pushField("Temp_Date2", dataRow.TEMPDATE2);
    pushField("Due_Date2", dataRow.DUEDATE2);
    pushField("Time3", dataRow.TIME3);
    pushField("Finish_Date3", dataRow.FINISHDATE3);
    pushField("Temp_Date3", dataRow.TEMPDATE3);
    pushField("Due_Date3", dataRow.DUEDATE3);
    pushField("Time4", dataRow.TIME4);
    pushField("Finish_Date4", dataRow.FINISHDATE4);
    pushField("Temp_Date4", dataRow.TEMPDATE4);
    pushField("Due_Date4", dataRow.DUEDATE4);
    pushField("Time5", dataRow.TIME5);
    pushField("Finish_Date5", dataRow.FINISHDATE5);
    pushField("Temp_Date5", dataRow.TEMPDATE5);
    pushField("Due_Date5", dataRow.DUEDATE5);
    pushField("Time6", dataRow.TIME6);
    pushField("Finish_Date6", dataRow.FINISHDATE6);
    pushField("Temp_Date6", dataRow.TEMPDATE6);
    pushField("Due_Date6", dataRow.DUEDATE6);
    pushField("Time7", dataRow.TIME7);
    pushField("Finish_Date7", dataRow.FINISHDATE7);
    pushField("Temp_Date7", dataRow.TEMPDATE7);
    pushField("Due_Date7", dataRow.DUEDATE7);
    pushField("Time8", dataRow.TIME8);
    pushField("Finish_Date8", dataRow.FINISHDATE8);
    pushField("Temp_Date8", dataRow.TEMPDATE8);
    pushField("Due_Date8", dataRow.DUEDATE8);
    pushField("Time9", dataRow.TIME9);
    pushField("Finish_Date9", dataRow.FINISHDATE9);
    pushField("Temp_Date9", dataRow.TEMPDATE9);
    pushField("Due_Date9", dataRow.DUEDATE9);
    pushField("Time10", dataRow.TIME10);
    pushField("Finish_Date10", dataRow.FINISHDATE10);
    pushField("Temp_Date10", dataRow.TEMPDATE10);
    pushField("Due_Date10", dataRow.DUEDATE10);
    pushField("Temp_Date0", dataRow.TEMPDATE0);
    pushField("Due_Date0", dataRow.DUEDATE0);
    pushField("Instrument", dataRow.INSTRUMENT);
    pushField("Method", dataRow.METHOD);
    pushField("Incharge", dataRow.INCHARGE);
    pushField("Approved_Date", dataRow.APPROVEDDATE);
    pushField("Approved_By", dataRow.APPROVEDBY);
    pushField("Status", dataRow.STATUS);
    pushField("Remark", dataRow.REMARK);
    pushField("CheckBox", dataRow.CHECKBOX);

    let query = `
        UPDATE [SALTSPRAY].[dbo].[DataTable]
        SET ${fields.join(',\n')}
        WHERE Request_No = '${dataRow.REQUESTNO}' and Status = '${dataRow.STATUS}'
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

router.post('/02SALTSPRAY/StartJob', async (req, res) => {
    //-------------------------------------
    console.log("--StartJob--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Type", dataRow.TYPE);
    pushField("Request_No", dataRow.REQUESTNO);
    pushField("Report_No", dataRow.REPORTNO);
    pushField("Section", dataRow.SECTION);
    pushField("Requester", dataRow.REQUESTER);
    pushField("Received_Date", dataRow.RECEIVEDDATE);
    pushField("Customer_Name", dataRow.CUSTOMERNAME);
    pushField("Part_Name1", dataRow.PARTNAME1);
    pushField("Part_No1", dataRow.PARTNO1);
    pushField("Lot_No1", dataRow.LOTNO1);
    pushField("Amount1", dataRow.AMOUNT1);
    pushField("Material1", dataRow.MATERIAL1);
    pushField("Process1", dataRow.PROCESS1);
    pushField("Part_Name2", dataRow.PARTNAME2);
    pushField("Part_No2", dataRow.PARTNO2);
    pushField("Lot_No2", dataRow.LOTNO2);
    pushField("Amount2", dataRow.AMOUNT2);
    pushField("Material2", dataRow.MATERIAL2);
    pushField("Process2", dataRow.PROCESS2);
    pushField("Part_Name3", dataRow.PARTNAME3);
    pushField("Part_No3", dataRow.PARTNO3);
    pushField("Lot_No3", dataRow.LOTNO3);
    pushField("Amount3", dataRow.AMOUNT3);
    pushField("Material3", dataRow.MATERIAL3);
    pushField("Process3", dataRow.PROCESS3);
    pushField("Part_Name4", dataRow.PARTNAME4);
    pushField("Part_No4", dataRow.PARTNO4);
    pushField("Lot_No4", dataRow.LOTNO4);
    pushField("Amount4", dataRow.AMOUNT4);
    pushField("Material4", dataRow.MATERIAL4);
    pushField("Process4", dataRow.PROCESS4);
    pushField("Part_Name5", dataRow.PARTNAME5);
    pushField("Part_No5", dataRow.PARTNO5);
    pushField("Lot_No5", dataRow.LOTNO5);
    pushField("Amount5", dataRow.AMOUNT5);
    pushField("Material5", dataRow.MATERIAL5);
    pushField("Process5", dataRow.PROCESS5);
    pushField("Part_Name6", dataRow.PARTNAME6);
    pushField("Part_No6", dataRow.PARTNO6);
    pushField("Lot_No6", dataRow.LOTNO6);
    pushField("Amount6", dataRow.AMOUNT6);
    pushField("Material6", dataRow.MATERIAL6);
    pushField("Process6", dataRow.PROCESS6);
    pushField("Part_Name7", dataRow.PARTNAME7);
    pushField("Part_No7", dataRow.PARTNO7);
    pushField("Lot_No7", dataRow.LOTNO7);
    pushField("Amount7", dataRow.AMOUNT7);
    pushField("Material7", dataRow.MATERIAL7);
    pushField("Process7", dataRow.PROCESS7);
    pushField("Part_Name8", dataRow.PARTNAME8);
    pushField("Part_No8", dataRow.PARTNO8);
    pushField("Lot_No8", dataRow.LOTNO8);
    pushField("Amount8", dataRow.AMOUNT8);
    pushField("Material8", dataRow.MATERIAL8);
    pushField("Process8", dataRow.PROCESS8);
    pushField("Part_Name9", dataRow.PARTNAME9);
    pushField("Part_No9", dataRow.PARTNO9);
    pushField("Lot_No9", dataRow.LOTNO9);
    pushField("Amount9", dataRow.AMOUNT9);
    pushField("Material9", dataRow.MATERIAL9);
    pushField("Process9", dataRow.PROCESS9);
    pushField("Part_Name10", dataRow.PARTNAME10);
    pushField("Part_No10", dataRow.PARTNO10);
    pushField("Lot_No10", dataRow.LOTNO10);
    pushField("Amount10", dataRow.AMOUNT10);
    pushField("Material10", dataRow.MATERIAL10);
    pushField("Process10", dataRow.PROCESS10);
    // pushField("Amount_Sample", dataRow.AMOUNTSAMPLE);
    pushField("Take_Photo", dataRow.TAKEPHOTO);
    pushField("Start_Date", dataRow.STARTDATE);
    pushField("Time1", dataRow.TIME1);
    pushField("Finish_Date1", dataRow.FINISHDATE1);
    pushField("Temp_Date1", dataRow.TEMPDATE1);
    pushField("Due_Date1", dataRow.DUEDATE1);
    pushField("Time2", dataRow.TIME2);
    pushField("Finish_Date2", dataRow.FINISHDATE2);
    pushField("Temp_Date2", dataRow.TEMPDATE2);
    pushField("Due_Date2", dataRow.DUEDATE2);
    pushField("Time3", dataRow.TIME3);
    pushField("Finish_Date3", dataRow.FINISHDATE3);
    pushField("Temp_Date3", dataRow.TEMPDATE3);
    pushField("Due_Date3", dataRow.DUEDATE3);
    pushField("Time4", dataRow.TIME4);
    pushField("Finish_Date4", dataRow.FINISHDATE4);
    pushField("Temp_Date4", dataRow.TEMPDATE4);
    pushField("Due_Date4", dataRow.DUEDATE4);
    pushField("Time5", dataRow.TIME5);
    pushField("Finish_Date5", dataRow.FINISHDATE5);
    pushField("Temp_Date5", dataRow.TEMPDATE5);
    pushField("Due_Date5", dataRow.DUEDATE5);
    pushField("Time6", dataRow.TIME6);
    pushField("Finish_Date6", dataRow.FINISHDATE6);
    pushField("Temp_Date6", dataRow.TEMPDATE6);
    pushField("Due_Date6", dataRow.DUEDATE6);
    pushField("Time7", dataRow.TIME7);
    pushField("Finish_Date7", dataRow.FINISHDATE7);
    pushField("Temp_Date7", dataRow.TEMPDATE7);
    pushField("Due_Date7", dataRow.DUEDATE7);
    pushField("Time8", dataRow.TIME8);
    pushField("Finish_Date8", dataRow.FINISHDATE8);
    pushField("Temp_Date8", dataRow.TEMPDATE8);
    pushField("Due_Date8", dataRow.DUEDATE8);
    pushField("Time9", dataRow.TIME9);
    pushField("Finish_Date9", dataRow.FINISHDATE9);
    pushField("Temp_Date9", dataRow.TEMPDATE9);
    pushField("Due_Date9", dataRow.DUEDATE9);
    pushField("Time10", dataRow.TIME10);
    pushField("Finish_Date10", dataRow.FINISHDATE10);
    pushField("Temp_Date10", dataRow.TEMPDATE10);
    pushField("Due_Date10", dataRow.DUEDATE10);
    pushField("Temp_Date0", dataRow.TEMPDATE0);
    pushField("Due_Date0", dataRow.DUEDATE0);
    pushField("Instrument", dataRow.INSTRUMENT);
    pushField("Method", dataRow.METHOD);
    pushField("Incharge", dataRow.INCHARGE);
    pushField("Approved_Date", dataRow.APPROVEDDATE);
    pushField("Approved_By", dataRow.APPROVEDBY);
    pushField("Status", "START");
    pushField("Remark", dataRow.REMARK);
    pushField("CheckBox", dataRow.CHECKBOX);

    let query = `
        UPDATE [SALTSPRAY].[dbo].[DataTable]
        SET ${fields.join(',\n')}
        WHERE Request_No = '${dataRow.REQUESTNO}' and Status = '${dataRow.STATUS}'
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

router.post('/02SALTSPRAY/CancelJob', async (req, res) => {
    //-------------------------------------
    console.log("--CancelJob--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Status", "CANCEL");

    let query = `
        UPDATE [SALTSPRAY].[dbo].[DataTable]
        SET ${fields.join(',\n')}
        WHERE Request_No = '${dataRow.REQUESTNO}' and Status = '${dataRow.STATUS}'
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

router.post('/02SALTSPRAY/FinishJob', async (req, res) => {
    //-------------------------------------
    console.log("--FinishJob--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Status", "FINISH");

    let query = `
        UPDATE [SALTSPRAY].[dbo].[DataTable]
        SET ${fields.join(',\n')}
        WHERE Request_No = '${dataRow.REQUESTNO}' and Status = '${dataRow.STATUS}'
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

router.post('/02SALTSPRAY/AddData', async (req, res) => {
    //-------------------------------------
    console.log("--AddData--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '' && value !== null && value !== 'null') {
    //         fields.push(`[${name}] = '${value}'`);
    //     }
    // }

    function pushField(name, value) {
        console.log(name, value);
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
            console.log(`[${name}] = N'${escapedValue}'`);

        }
    }


    pushField("Type", dataRow.TYPE);
    pushField("Request_No", dataRow.REQUESTNO);
    pushField("Report_No", dataRow.REPORTNO);
    pushField("Section", dataRow.SECTION);
    pushField("Requester", dataRow.REQUESTER);
    pushField("Sampling_Date", dataRow.SAMPLINGDATE);
    pushField("Received_Date", dataRow.RECEIVEDDATE);
    pushField("Customer_Name", dataRow.CUSTOMERNAME);
    pushField("Part_Name1", dataRow.PARTNAME1);
    pushField("Part_No1", dataRow.PARTNO1);
    pushField("Lot_No1", dataRow.LOTNO1);
    pushField("Amount1", dataRow.AMOUNT1);
    pushField("Material1", dataRow.MATERIAL1);
    pushField("Process1", dataRow.PROCESS1);
    pushField("Part_Name2", dataRow.PARTNAME2);
    pushField("Part_No2", dataRow.PARTNO2);
    pushField("Lot_No2", dataRow.LOTNO2);
    pushField("Amount2", dataRow.AMOUNT2);
    pushField("Material2", dataRow.MATERIAL2);
    pushField("Process2", dataRow.PROCESS2);
    pushField("Part_Name3", dataRow.PARTNAME3);
    pushField("Part_No3", dataRow.PARTNO3);
    pushField("Lot_No3", dataRow.LOTNO3);
    pushField("Amount3", dataRow.AMOUNT3);
    pushField("Material3", dataRow.MATERIAL3);
    pushField("Process3", dataRow.PROCESS3);
    pushField("Part_Name4", dataRow.PARTNAME4);
    pushField("Part_No4", dataRow.PARTNO4);
    pushField("Lot_No4", dataRow.LOTNO4);
    pushField("Amount4", dataRow.AMOUNT4);
    pushField("Material4", dataRow.MATERIAL4);
    pushField("Process4", dataRow.PROCESS4);
    pushField("Part_Name5", dataRow.PARTNAME5);
    pushField("Part_No5", dataRow.PARTNO5);
    pushField("Lot_No5", dataRow.LOTNO5);
    pushField("Amount5", dataRow.AMOUNT5);
    pushField("Material5", dataRow.MATERIAL5);
    pushField("Process5", dataRow.PROCESS5);
    pushField("Part_Name6", dataRow.PARTNAME6);
    pushField("Part_No6", dataRow.PARTNO6);
    pushField("Lot_No6", dataRow.LOTNO6);
    pushField("Amount6", dataRow.AMOUNT6);
    pushField("Material6", dataRow.MATERIAL6);
    pushField("Process6", dataRow.PROCESS6);
    pushField("Part_Name7", dataRow.PARTNAME7);
    pushField("Part_No7", dataRow.PARTNO7);
    pushField("Lot_No7", dataRow.LOTNO7);
    pushField("Amount7", dataRow.AMOUNT7);
    pushField("Material7", dataRow.MATERIAL7);
    pushField("Process7", dataRow.PROCESS7);
    pushField("Part_Name8", dataRow.PARTNAME8);
    pushField("Part_No8", dataRow.PARTNO8);
    pushField("Lot_No8", dataRow.LOTNO8);
    pushField("Amount8", dataRow.AMOUNT8);
    pushField("Material8", dataRow.MATERIAL8);
    pushField("Process8", dataRow.PROCESS8);
    pushField("Part_Name9", dataRow.PARTNAME9);
    pushField("Part_No9", dataRow.PARTNO9);
    pushField("Lot_No9", dataRow.LOTNO9);
    pushField("Amount9", dataRow.AMOUNT9);
    pushField("Material9", dataRow.MATERIAL9);
    pushField("Process9", dataRow.PROCESS9);
    pushField("Part_Name10", dataRow.PARTNAME10);
    pushField("Part_No10", dataRow.PARTNO10);
    pushField("Lot_No10", dataRow.LOTNO10);
    pushField("Amount10", dataRow.AMOUNT10);
    pushField("Material10", dataRow.MATERIAL10);
    pushField("Process10", dataRow.PROCESS10);
    // pushField("Amount_Sample", dataRow.AMOUNTSAMPLE);
    pushField("Take_Photo", dataRow.TAKEPHOTO);
    pushField("Start_Date", dataRow.STARTDATE);
    pushField("Time1", dataRow.TIME1);
    pushField("Finish_Date1", dataRow.FINISHDATE1);
    pushField("Temp_Date1", dataRow.TEMPDATE1);
    pushField("Due_Date1", dataRow.DUEDATE1);
    pushField("Time2", dataRow.TIME2);
    pushField("Finish_Date2", dataRow.FINISHDATE2);
    pushField("Temp_Date2", dataRow.TEMPDATE2);
    pushField("Due_Date2", dataRow.DUEDATE2);
    pushField("Time3", dataRow.TIME3);
    pushField("Finish_Date3", dataRow.FINISHDATE3);
    pushField("Temp_Date3", dataRow.TEMPDATE3);
    pushField("Due_Date3", dataRow.DUEDATE3);
    pushField("Time4", dataRow.TIME4);
    pushField("Finish_Date4", dataRow.FINISHDATE4);
    pushField("Temp_Date4", dataRow.TEMPDATE4);
    pushField("Due_Date4", dataRow.DUEDATE4);
    pushField("Time5", dataRow.TIME5);
    pushField("Finish_Date5", dataRow.FINISHDATE5);
    pushField("Temp_Date5", dataRow.TEMPDATE5);
    pushField("Due_Date5", dataRow.DUEDATE5);
    pushField("Time6", dataRow.TIME6);
    pushField("Finish_Date6", dataRow.FINISHDATE6);
    pushField("Temp_Date6", dataRow.TEMPDATE6);
    pushField("Due_Date6", dataRow.DUEDATE6);
    pushField("Time7", dataRow.TIME7);
    pushField("Finish_Date7", dataRow.FINISHDATE7);
    pushField("Temp_Date7", dataRow.TEMPDATE7);
    pushField("Due_Date7", dataRow.DUEDATE7);
    pushField("Time8", dataRow.TIME8);
    pushField("Finish_Date8", dataRow.FINISHDATE8);
    pushField("Temp_Date8", dataRow.TEMPDATE8);
    pushField("Due_Date8", dataRow.DUEDATE8);
    pushField("Time9", dataRow.TIME9);
    pushField("Finish_Date9", dataRow.FINISHDATE9);
    pushField("Temp_Date9", dataRow.TEMPDATE9);
    pushField("Due_Date9", dataRow.DUEDATE9);
    pushField("Time10", dataRow.TIME10);
    pushField("Finish_Date10", dataRow.FINISHDATE10);
    pushField("Temp_Date10", dataRow.TEMPDATE10);
    pushField("Due_Date10", dataRow.DUEDATE10);
    pushField("Temp_Date0", dataRow.TEMPDATE0);
    pushField("Due_Date0", dataRow.DUEDATE0);
    pushField("Instrument", dataRow.INSTRUMENT);
    pushField("Method", dataRow.METHOD);
    pushField("Incharge", dataRow.INCHARGE);
    pushField("Approved_Date", dataRow.APPROVEDDATE);
    pushField("Approved_By", dataRow.APPROVEDBY);
    pushField("Status", dataRow.STATUS);
    pushField("Remark", dataRow.REMARK);
    pushField("CheckBox", dataRow.CHECKBOX);
    console.log('-----------------');
    console.log(fields);
    let query = `
    INSERT INTO [SALTSPRAY].[dbo].[DataTable] (
      ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
    )
    VALUES (
     ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
    )
    `;
    console.log(query);
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

router.post('/02SALTSPRAY/AddCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--AddCustomer--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '' && value !== null && value !== 'null') {
    //         fields.push(`[${name}] = '${value}'`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        }
    }

    pushField("Customer_Name", dataRow.CUSTOMER);

    let query = `
    INSERT INTO [SALTSPRAY].[dbo].[Customer] (
      ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
    )
    VALUES (
      ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
    )
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Insert Success");
        return res.status(200).json('เพิ่มข้อมูลสำเร็จ');
    } else {
        console.log("Insert Failed");
        return res.status(400).json('เพิ่มข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/AddRequester', async (req, res) => {
    //-------------------------------------
    console.log("--AddRequester--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '' && value !== null && value !== 'null') {
    //         fields.push(`[${name}] = '${value}'`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        }
    }

    pushField("Requester_Name", dataRow.REQUESTER);

    let query = `
    INSERT INTO [SALTSPRAY].[dbo].[Requester] (
      ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
    )
    VALUES (
      ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
    )
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Insert Success");
        return res.status(200).json('เพิ่มข้อมูลสำเร็จ');
    } else {
        console.log("Insert Failed");
        return res.status(400).json('เพิ่มข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/AddUser', async (req, res) => {
    //-------------------------------------
    console.log("--AddUser--");
    //-------------------------------------

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '' && value !== null && value !== 'null') {
    //         fields.push(`[${name}] = '${value}'`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        }
    }

    pushField("UserName", req.body.UserName);
    pushField("Password", req.body.Password);
    pushField("Name", req.body.Name);
    pushField("Section", req.body.Section);
    pushField("Branch", req.body.Branch);
    pushField("Roleid", req.body.Roleid);

    let query = `
    INSERT INTO [SALTSPRAY].[dbo].[Master_User] (
      ${fields.map(field => field.split('=')[0].trim()).join(',\n')}
    )
    VALUES (
      ${fields.map(field => field.split('=').slice(1).join('=').trim()).join(',\n')}
    )
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Insert Success");
        return res.status(200).json('เพิ่มข้อมูลสำเร็จ');
    } else {
        console.log("Insert Failed");
        return res.status(400).json('เพิ่มข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/DeleteCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--DeleteCustomer--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let query = `
    DELETE FROM [SALTSPRAY].[dbo].[Customer] WHERE ID = '${dataRow.ID}';
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Delete Success");
        return res.status(200).json('ลบข้อมูลสำเร็จ');
    } else {
        console.log("Delete Failed");
        return res.status(400).json('ลบข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/DeleteRequester', async (req, res) => {
    //-------------------------------------
    console.log("--DeleteRequester--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let query = `
    DELETE FROM [SALTSPRAY].[dbo].[Requester] WHERE ID = '${dataRow.ID}';
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Delete Success");
        return res.status(200).json('ลบข้อมูลสำเร็จ');
    } else {
        console.log("Delete Failed");
        return res.status(400).json('ลบข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/DeleteUser', async (req, res) => {
    //-------------------------------------
    console.log("--DeleteUser--");
    //-------------------------------------
    let query = `
    DELETE FROM [SALTSPRAY].[dbo].[Master_User] WHERE ID = '${req.body.UserID}';
    `;
    // console.log(query);
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["rowsAffected"][0] > 0) {
        console.log("Delete Success");
        return res.status(200).json('ลบข้อมูลสำเร็จ');
    } else {
        console.log("Delete Failed");
        return res.status(400).json('ลบข้อมูลไม่สำเร็จ');
    }
    //-------------------------------------

});

router.post('/02SALTSPRAY/EditCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--EditCustomer--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Customer_Name", dataRow.CUSTOMER);

    let query = `
        UPDATE [SALTSPRAY].[dbo].[Customer]
        SET ${fields.join(',\n')}
        WHERE ID = '${dataRow.ID}'
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

router.post('/02SALTSPRAY/EditRequester', async (req, res) => {
    //-------------------------------------
    console.log("--EditRequester--");
    //-------------------------------------
    let dataRow = JSON.parse(req.body.dataRow);
    // console.log(dataRow);

    let fields = [];
    // function pushField(name, value) {
    //     if (value !== '') {
    //         fields.push(`[${name}] = '${value}'`);
    //     } else {
    //         fields.push(`[${name}] = NULL`);
    //     }
    // }

    function pushField(name, value) {
        if (value !== '' && value !== null && value !== 'null') {
            const escapedValue = value.toString().replace(/'/g, "''");
            fields.push(`[${name}] = N'${escapedValue}'`);
        } else {
            fields.push(`[${name}] = NULL`);
        }
    }

    pushField("Requester_Name", dataRow.REQUESTER);

    let query = `
        UPDATE [SALTSPRAY].[dbo].[Requester]
        SET ${fields.join(',\n')}
        WHERE ID = '${dataRow.ID}'
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

router.post('/02SALTSPRAY/Holidays', async (req, res) => {
    //-------------------------------------
    console.log("--DataTable--");
    //-------------------------------------
    let output = [];
    let query = `SELECT HolidayDate FROM [SAR].[dbo].[Master_Holiday]`
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        // console.log("Alldata: " + buffer.length);
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูลวันหยุด');
    }
    //-------------------------------------
});

router.post('/02SALTSPRAY/CheckSlotAndTimeOverlab', async (req, res) => {
    //-------------------------------------
    console.log("--CheckSlotAndTimeOverlab--");
    //-------------------------------------
    const { startDate, finishDate, checkBox, Instrument } = req.body;
    // console.log(startDate);
    // console.log(finishDate);
    // console.log(checkBox);
    // console.log(Instrument);
    if (!startDate || !finishDate || !checkBox || !Instrument) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let query = `SELECT * FROM [SALTSPRAY].[dbo].[DataTable]
        WHERE Instrument = '${Instrument}'
          AND Status NOT IN ('CANCEL', 'TRANSFER', 'FINISH') order by Request_No`;
        let result = await mssql.qurey(query);
        // console.log(query);

        const bookings = result.recordset;
        const newStart = new Date(startDate);
        const newFinish = new Date(finishDate);
        const newSlots = checkBox.split(',').map(s => s.trim());
        // console.log(bookings);
        // console.log(newStart);
        // console.log(newFinish);
        // console.log(newSlots);
        // console.log('-------------------');

        const overlappedRequests = [];

        for (const booking of bookings) {
            // const existingStart = new Date(booking.Start_Date);
            const existingStart = new Date(new Date(booking.Start_Date).getTime() - 7 * 60 * 60 * 1000);
            let latestFinish = null;
            // console.log('Start Date: ' + existingStart);
            // หา Finish_Date ที่มีค่ามากที่สุด
            for (let i = 1; i <= 10; i++) {
                const finishKey = `Finish_Date${i}`;
                if (booking[finishKey]) {
                    // latestFinish = new Date(booking[finishKey]);
                    latestFinish = new Date(new Date(booking[finishKey]).getTime() - 7 * 60 * 60 * 1000);
                }
            }
            // console.log('Finsih Date: ' + latestFinish);
            if (!latestFinish) continue;

            const timeOverlap = !(newFinish < existingStart || newStart > latestFinish);
            // console.log(timeOverlap);
            // เปรียบเทียบ Slot
            const existingSlots = (booking.CheckBox || "").split(',').map(s => s.trim());
            // console.log(existingSlots);
            const slotOverlap = newSlots.some(slot => existingSlots.includes(slot));

            if (timeOverlap && slotOverlap) {
                overlappedRequests.push(booking.Request_No + ' ที่ช่อง: ' + booking.CheckBox + ' เวลา: ' + formatDateTime(existingStart) + ' ถึง ' + formatDateTime(latestFinish));
            }
        }

        if (overlappedRequests.length > 0) {
            return res.status(200).json({
                isOverlap: true,
                overlappedRequests,
                message: 'พบข้อมูลช่วงเวลาหรือช่องที่ซ้อนกัน'
            });
        } else {
            return res.status(200).json({
                isOverlap: false,
                overlappedRequests: [],
                message: 'ไม่มีข้อมูลซ้อนกัน'
            });
        }
    } catch (err) {
        console.error('CheckSlotAndTimeOverlab Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

function formatDateTime(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}



module.exports = router;