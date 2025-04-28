const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');
var mssqlR = require('../../function/mssqlR');
var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');
const e = require("express");
const schedule = require("node-schedule");

router.get('/02SARKPI/TEST', async (req, res) => {
    // console.log(mssql.qurey())
    return res.json("SARKPI V0.1");
});

router.post('/02SALTSPRAY/DataTable', async (req, res) => {
    //-------------------------------------
    console.log("--DataTable--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[DataTable] `
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        console.log("Alldata: " + buffer.length);
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูลในตาราง');
    }
    //-------------------------------------
});

router.post('/02SALTSPRAY/SearchCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--SearchCustomer--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SALTSPRAY].[dbo].[Customer] `
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        console.log("Alldata: " + buffer.length);
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
    let query = `SELECT * From [SALTSPRAY].[dbo].[Incharge] order by Incharge`
    let db = await mssql.qurey(query);
    // console.log(db);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        console.log("Alldata: " + buffer.length);
        output = buffer;
        // console.log(output);
        return res.status(200).json(output);
        // return res.status(400).json('ไม่พบข้อมูลลูกค้า');
    } else {
        return res.status(400).json('ไม่พบข้อมูลผู้รับผิดชอบ');
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
    console.log(dataRow);

    let fields = [];
    function pushField(name, value) {
        if (value !== '') {
            fields.push(`[${name}] = '${value}'`);
        }
    }

    pushField("Request_No", dataRow.REQUESTNO);
    pushField("Report_No", dataRow.REPORTNO);
    pushField("Section", dataRow.SECTION);
    pushField("Requester", dataRow.REQUESTER);
    pushField("Received_Date", dataRow.RECEIVEDDATE);
    pushField("Customer_Name", dataRow.CUSTOMERNAME);
    pushField("Part_Name1", dataRow.PARTNAME1);
    pushField("Part_No1", dataRow.PARTNO1);
    pushField("Part_Name2", dataRow.PARTNAME2);
    pushField("Part_No2", dataRow.PARTNO2);
    pushField("Part_Name3", dataRow.PARTNAME3);
    pushField("Part_No3", dataRow.PARTNO3);
    pushField("Part_Name4", dataRow.PARTNAME4);
    pushField("Part_No4", dataRow.PARTNO4);
    pushField("Part_Name5", dataRow.PARTNAME5);
    pushField("Part_No5", dataRow.PARTNO5);
    pushField("Part_Name6", dataRow.PARTNAME6);
    pushField("Part_No6", dataRow.PARTNO6);
    pushField("Part_Name7", dataRow.PARTNAME7);
    pushField("Part_No7", dataRow.PARTNO7);
    pushField("Part_Name8", dataRow.PARTNAME8);
    pushField("Part_No8", dataRow.PARTNO8);
    pushField("Part_Name9", dataRow.PARTNAME9);
    pushField("Part_No9", dataRow.PARTNO9);
    pushField("Part_Name10", dataRow.PARTNAME10);
    pushField("Part_No10", dataRow.PARTNO10);
    pushField("Amount_Sample", dataRow.AMOUNTSAMPLE);
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
        WHERE Request_No = '${dataRow.REQUESTNO}'
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
        console.log("Alldata: " + buffer.length);
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูลวันหยุด');
    }
    //-------------------------------------
});

module.exports = router;