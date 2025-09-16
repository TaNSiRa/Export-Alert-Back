const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');

router.get('/02MASTERSAR/TEST', async (req, res) => {
    return res.json("SARKPI V0.1");
});

router.post('/02MASTERSAR/getAllCustomer', async (req, res) => {
    //-------------------------------------
    console.log("--getAllCustomer--");
    //-------------------------------------
    let output = [];
    let query = `SELECT 
                CustShort,
                MAX(Id) AS Id,
                MAX(CustId) AS CustId,
                MAX(CustFull) AS CustFull,
                MAX(Incharge) AS Incharge,
                MAX(SampleNo) AS SampleNo,
                MAX(GroupNameTS) AS GroupNameTS,
                MAX(SampleGroup) AS SampleGroup,
                MAX(SampleType) AS SampleType,
                MAX(SampleTank) AS SampleTank,
                MAX(SampleName) AS SampleName,
                MAX(ProcessReportName) AS ProcessReportName,
                MAX(ItemNo) AS ItemNo,
                MAX(ItemName) AS ItemName,
                MAX(ItemReportName) AS ItemReportName,
                MAX(StdFactor) AS StdFactor,
                MAX(StdMin) AS StdMin,
                MAX(StdSymbol) AS StdSymbol,
                MAX(StdMax) AS StdMax,
                MAX(ControlRange) AS ControlRange,
                MAX(SubLeader) AS SubLeader,
                MAX(GL) AS GL,
                MAX(JP) AS JP,
                MAX(DGM) AS DGM,
                MAX(PatternReport) AS PatternReport,
                MAX(ReportOrder) AS ReportOrder,

                MAX(NULLIF(TYPE, '')) AS TYPE,
                MAX(NULLIF([GROUP], '')) AS [GROUP],
                MAX(NULLIF(MKTGROUP, '')) AS MKTGROUP,
                MAX(NULLIF(FRE, '')) AS FRE,
                MAX(NULLIF(REPORTITEMS, '')) AS REPORTITEMS

            FROM [SAR].[dbo].[Routine_MasterPatternTS]
            GROUP BY CustShort
            ORDER BY CustFull;
            `;
    // WHERE Incharge NOT IN ('QC-SOI8','MFT-SOI8','K.SIRAWIT','PHO','ENV','GAS','ISN','KAN', 'ARSA CHUMNANDECHAKUL')
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/masterDetail', async (req, res) => {
    //-------------------------------------
    console.log("--masterDetail--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SAR].[dbo].[${req.body.masterType}] 
                 WHERE CustShort = '${req.body.CustShort}'
                 order by SampleNo, ItemNo;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getUser', async (req, res) => {
    //-------------------------------------
    console.log("--getUser--");
    //-------------------------------------
    let output = [];
    let query = `SELECT * From [SAR].[dbo].[Master_User] ORDER BY Name;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getGroupNameTS', async (req, res) => {
    //-------------------------------------
    console.log("--getGroupNameTS--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT GroupNameTS From [SAR].[dbo].[Routine_MasterPatternTS] ORDER BY GroupNameTS;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getSampleGroupTS', async (req, res) => {
    //-------------------------------------
    console.log("--getSampleGroupTS--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT SampleGroup From [SAR].[dbo].[Routine_MasterPatternTS] ORDER BY SampleGroup;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getSampleTypeTS', async (req, res) => {
    //-------------------------------------
    console.log("--getSampleTypeTS--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT SampleType From [SAR].[dbo].[Routine_MasterPatternTS] ORDER BY SampleType;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});



router.post('/02MASTERSAR/getItemTS', async (req, res) => {
    //-------------------------------------
    console.log("--getItemTS--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT ItemName From [SAR].[dbo].[Routine_MasterPatternTS] ORDER BY ItemName;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getSampleGroupLab', async (req, res) => {
    //-------------------------------------
    console.log("--getSampleGroupLab--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT SampleGroup From [SAR].[dbo].[Routine_MasterPatternLab] ORDER BY SampleGroup;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getSampleTypeLab', async (req, res) => {
    //-------------------------------------
    console.log("--getSampleTypeLab--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT SampleType From [SAR].[dbo].[Routine_MasterPatternLab] ORDER BY SampleType;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/getItemLab', async (req, res) => {
    //-------------------------------------
    console.log("--getItemLab--");
    //-------------------------------------
    let output = [];
    let query = `SELECT DISTINCT ItemName, InstrumentName 
    From [SAR].[dbo].[Routine_MasterPatternLab] 
    ORDER BY InstrumentName, ItemName;`;
    let db = await mssql.qurey(query);
    if (db["recordsets"].length > 0) {
        let buffer = db["recordsets"][0];
        output = buffer;
        return res.status(200).json(output);
    } else {
        return res.status(400).json('ไม่พบข้อมูล');
    }
});

router.post('/02MASTERSAR/confirmEditData', async (req, res) => {
    //-------------------------------------
    console.log("--confirmEditData--");
    //-------------------------------------
    try {
        let tableName = req.body.masterType;
        let data = JSON.parse(req.body.data);
        if (!tableName || !Array.isArray(data)) {
            return res.status(400).json({ error: "Missing tableName or data array" });
        }

        // 1. ดึงข้อมูลเดิมจาก SQL
        const selectQuery = `SELECT * FROM [SAR].[dbo].[${tableName}] WHERE CustShort = '${data[0]?.CustShort || ''}' ORDER BY ReportOrder;`;
        const db = await mssql.qurey(selectQuery);
        const oldData = db.recordsets[0] || [];
        // 2. สร้าง map ของ Id เดิม
        const oldMap = new Map(oldData.map(row => [String(row.Id), row]));
        // 3. เตรียม SQL statements
        const insertStatements = [];
        const updateStatements = [];
        const deleteStatements = [];
        const newIds = new Set();

        for (let row of data) {
            const rowId = String(row['Id']);
            const isDeleted = row['deleted'] === true;

            if (isDeleted && rowId) {
                // ถ้า mark deleted → ลบออกจาก DB
                deleteStatements.push(`DELETE FROM [SAR].[dbo].[${tableName}] WHERE Id = ${rowId}`);
                continue; // ไม่ต้องทำ insert/update
            }

            if (rowId && oldMap.has(rowId)) {
                // Update
                newIds.add(rowId);
                const updates = Object.entries(row)
                    .filter(([key, _]) => key !== 'Id' && key !== 'deleted')
                    .map(([key, value]) => `[${key}] = '${value}'`)
                    .join(', ');

                updateStatements.push(`UPDATE [SAR].[dbo].[${tableName}] SET ${updates} WHERE Id = ${rowId}`);
            } else if (!isDeleted) {
                // Insert
                const rowWithoutId = Object.fromEntries(
                    Object.entries(row).filter(([key, _]) => key !== 'Id' && key !== 'deleted')
                );
                const columns = Object.keys(rowWithoutId).map(k => `[${k}]`).join(', ');
                const values = Object.values(rowWithoutId).map(v => `'${v}'`).join(', ');
                insertStatements.push(`INSERT INTO [SAR].[dbo].[${tableName}] (${columns}) VALUES (${values})`);
            }
        }

        // 5. รวม statement ทั้งหมด
        const allStatements = [...insertStatements, ...updateStatements, ...deleteStatements];

        for (let stmt of allStatements) {
            await mssql.qurey(stmt);
        }

        return res.status(200).json({ message: "Data updated successfully", inserted: insertStatements.length, updated: updateStatements.length, deleted: deleteStatements.length });

    } catch (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
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