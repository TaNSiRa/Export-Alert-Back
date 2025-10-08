const nodemailer = require("nodemailer");
const cron = require("node-cron");
const express = require("express");
const router = express.Router();
var mssql = require("../../function/mssql");
require("dotenv").config();

// ========================================
// 1. Configuration
// ========================================
const emailConfig = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.mail365_user,
        pass: process.env.mail365_pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

// สร้าง transporter
const transporter = nodemailer.createTransport(emailConfig);

// ========================================
// 2. Function: จัดกลุ่มข้อมูลตาม status
// ========================================
function groupDataByStatus(data) {
    const statusMap = {};

    data.forEach((item) => {
        if (item.status && item.status.trim() !== "") {
            if (!statusMap[item.status]) {
                statusMap[item.status] = [];
            }
            statusMap[item.status].push(item);
        }
    });

    return statusMap;
}

// ========================================
// 3. Function: สร้าง HTML Email Template
// ========================================
function generateEmailHTML(statusMap) {
    const statusConfig = [
        { name: "Receive PO", icon: "🛒", color: "#4CAF50" },
        { name: "Sale Order in SAP", icon: "📋", color: "#2196F3" },
        { name: "Proforma.INV+PL", icon: "📄", color: "#FF9800" },
        { name: "Book shipment", icon: "📦", color: "#9C27B0" },
        { name: "Receive booking confirmation", icon: "📅", color: "#00BCD4" },
        { name: "Acknowledgement", icon: "✅", color: "#009688" },
        { name: "Delivery Order in SAP", icon: "🚚", color: "#3F51B5" },
        { name: "Loading Sheet", icon: "📊", color: "#795548" },
        { name: "Confirm Export Entry", icon: "✈️", color: "#FF5722" },
        { name: "Loading Date", icon: "🚛", color: "#E91E63" },
        { name: "Confirm Bill of Loading (B/L)", icon: "📃", color: "#CDDC39" },
        { name: "ETD", icon: "🛫", color: "#F44336" },
        { name: "Confirm Insurance", icon: "🛡️", color: "#607D8B" },
        { name: "Post goods issue & QC report", icon: "✔️", color: "#FFC107" },
        {
            name: "Send shipping document to customer",
            icon: "📤",
            color: "#673AB7",
        },
        { name: "Issue invoice for accounting", icon: "🧾", color: "#4CAF50" },
        {
            name: "Receive shipping&forwarder billing",
            icon: "💰",
            color: "#8BC34A",
        },
    ];

    let sectionsHTML = "";

    statusConfig.forEach((config) => {
        const statusData = statusMap[config.name] || [];
        if (statusData.length > 0) {
            sectionsHTML += generateStatusSection(
                config.name,
                config.icon,
                config.color,
                statusData
            );
        }
    });

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Shipment Report</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
        padding: 20px;
        line-height: 1.6;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        background: linear-gradient(135deg, #43a047, #2e7d32);
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: blue;
        color: white;
        padding: 30px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
      }
      .header h1 {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      .header p {
        font-size: 14px;
        opacity: 0.9;
      }
      .content {
        padding: 30px;
      }
      .status-section {
        margin-bottom: 40px;
        animation: fadeIn 0.5s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .status-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-radius: 16px;
        margin-bottom: 20px;
        color: white;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      }
      .status-icon {
        font-size: 36px;
        margin-right: 16px;
        background: rgba(255,255,255,0.2);
        padding: 12px;
        border-radius: 12px;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .status-title {
        flex: 1;
      }
      .status-title h2 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .status-title p {
        font-size: 14px;
        opacity: 0.95;
      }
      .shipment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .shipment-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid #f0f0f0;
      }
      .shipment-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      }
      .card-header {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .shipment-badge {
        background: linear-gradient(135deg, #1976d2, #1565c0);
        color: white;
        padding: 8px 14px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
      }
      .customer-name {
        font-size: 16px;
        font-weight: 700;
        color: #333;
        flex: 1;
        margin-left: 10px;
      }
      .card-body {
        padding: 16px;
        background: #fafafa;
      }
      .detail-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 14px;
        padding: 10px;
        background: white;
        border-radius: 10px;
        border-left: 4px solid #e0e0e0;
      }
      .detail-icon {
        font-size: 20px;
        margin-right: 12px;
        min-width: 24px;
      }
      .detail-content {
        flex: 1;
      }
      .detail-label {
        font-size: 11px;
        color: #757575;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .detail-value {
        font-size: 15px;
        font-weight: 600;
        color: #212121;
      }
      .status-info {
        background: linear-gradient(135deg, #f5f5f5, #eeeeee);
        padding: 14px;
        border-radius: 10px;
        border: 2px solid #e0e0e0;
        margin-top: 4px;
      }
      .status-text {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #212121;
        margin-bottom: 8px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .due-date {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #616161;
        font-weight: 500;
      }
      .due-icon {
        margin-right: 6px;
      }
      .footer {
        background: #f5f5f5;
        padding: 20px;
        text-align: center;
        color: #757575;
        font-size: 13px;
        border-top: 2px solid #e0e0e0;
      }
      .summary-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }
      .stat-card {
        background: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        text-align: center;
        min-width: 150px;
      }
      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #1976d2;
        margin-bottom: 4px;
      }
      .stat-label {
        font-size: 13px;
        color: #757575;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="container">
  <div class="header">
    <h1>
      📊 Daily Shipment Progress Report in 
      ${new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
    </h1>
    <p>
      Generated on ${new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })}
    </p>
    </div>
    </div>
      <div class="content">
        ${generateSummaryStats(statusMap)}
        ${sectionsHTML}
      </div>
      
      <div class="footer">
    <p>🔔 This is an automated daily report from Export Alert System</p>
    <p style="margin-top: 8px;">
        For any questions, please contact the automation team
    </p>
    <p style="margin-top: 8px;">
        If you want to access the system, click 
        <a href="http://172.23.10.168:12125/" target="_blank" style="color: #1a73e8; text-decoration: underline;">
            here
        </a>.
    </p>
    </div>

    </div>
  </body>
  </html>
  `;
}

// ========================================
// 4. Function: สร้าง Summary Statistics
// ========================================
function generateSummaryStats(statusMap) {
    const totalShipments = Object.values(statusMap).reduce(
        (sum, items) => sum + items.length,
        0
    );
    const totalStatuses = Object.keys(statusMap).length;

    let totalComplete = 0;
    for (const [status, items] of Object.entries(statusMap)) {
        if (status.toLowerCase().includes("complete")) {
            totalComplete += items.length;
        }
    }

    return `
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-number">${totalShipments}; color: blue;</div>
        <div class="stat-label">Total Shipments</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalStatuses}; color: orange;</div>
        <div class="stat-label">Active Statuses</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalComplete}; color: green;</div>
        <div class="stat-label">Complete Statuses</div>
      </div>
    </div>
  `;
}

// ========================================
// 5. Function: สร้าง HTML สำหรับแต่ละ Status
// ========================================
function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือน 0-11
    const year = String(date.getFullYear()).slice(-2); // เอา 2 ตัวท้าย
    return `${day}-${month}-${year}`;
}

function generateStatusSection(statusName, icon, color, data) {
    const cardsHTML = data
        .map(
            (item, index) => `
    <div class="shipment-card">
      <div class="card-header" style="background-color: ${color}30;">
        <div class="shipment-badge" style="background: linear-gradient(135deg, ${color}, ${adjustColor(
                color,
                -20
            )});color: black;">
          Shipment ${index + 1}
        </div>
        <div class="customer-name" style="color: black;">
          ${item.custshort || "-"}
        </div>
      </div>
      
      <div class="card-body">
        <div class="detail-row" style="border-left-color: ${color};">
          <div class="detail-icon">📋</div>
          <div class="detail-content">
            <div class="detail-label">PO Number</div>
            <div class="detail-value">${item.po_no || "-"}</div>
          </div>
        </div>
        
        <div class="detail-row" style="border-left-color: ${color};">
          <div class="detail-icon">✈️</div>
          <div class="detail-content">
            <div class="detail-label">ETD</div>
            <div class="detail-value">${formatDate(item.etd)}</div>
          </div>
        </div>
        
        <div class="detail-row" style="border-left-color: ${color};">
          <div class="detail-icon">ℹ️</div>
          <div class="detail-content">
            <div class="detail-label">Current Status & Due Date</div>
            <div class="status-info" style="border-color: ${color}40;">
              <div class="status-text">
                <div class="status-dot" style="background-color: ${color};"></div>
                ${item.status || "-"}
              </div>
              <div class="due-date">
                <span class="due-icon">📅</span>
                Due: ${formatDate(item.status_due)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
        )
        .join("");

    return `
  <div class="status-section">
    <div class="status-header" 
         style="background-color: ${color}30; color: black;">
      <div class="status-icon">${icon}</div>
      <div class="status-title">
        <h2>${statusName}</h2>
        <p>${data.length} Shipment${data.length > 1 ? "s" : ""}</p>
      </div>
    </div>
    <div class="shipment-grid">
      ${cardsHTML}
    </div>
  </div>
  `;
}

// ========================================
// 6. Helper Function: ปรับสีให้เข้มขึ้น
// ========================================
function adjustColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// ========================================
// 7. Function: ส่งอีเมล
// ========================================
async function sendDailyReport(recipients) {
    try {
        console.log("🔄 Fetching data from database...");

        // ดึงข้อมูลจาก SQL (ใช้โค้ดเดิมของคุณ)
        let query = `WITH R AS ( 
      SELECT  *, 
              ROW_NUMBER() OVER (PARTITION BY po_no ORDER BY user_input_date DESC) AS rn 
      FROM [Export_Alert].[dbo].[data_table]) 
      SELECT TOP 10000 * 
      FROM R 
      WHERE rn = 1 
      AND MONTH(etd) = MONTH(GETDATE())
      AND YEAR(etd) = YEAR(GETDATE())
      ORDER BY user_input_date DESC;`;

        let db = await mssql.qurey(query);

        if (!db["recordsets"] || db["recordsets"].length === 0) {
            console.log("❌ No data found in database");
            return;
        }

        const data = db["recordsets"][0];
        console.log(`✅ Fetched ${data.length} records`);

        // จัดกลุ่มข้อมูล
        const statusMap = groupDataByStatus(data);
        console.log(`📊 Grouped into ${Object.keys(statusMap).length} statuses`);

        // สร้าง HTML
        const htmlContent = generateEmailHTML(statusMap);

        // ตั้งค่าอีเมล
        const mailOptions = {
            from: emailConfig.auth.user,
            to: recipients.join(", "),
            subject: `📊 Daily Shipment Report - ${new Date().toLocaleDateString(
                "th-TH"
            )}`,
            html: htmlContent,
        };

        // const mailOptions = {
        //     from: 'es1_auto@thaiparker.co.th',
        //     to: 'sirawit@thaiparker.co.th',
        //     subject: 'test',
        //     // html: `test`
        // };

        // ส่งอีเมล
        console.log("📧 Sending email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
}

// ========================================
// 8. ตั้งเวลาส่งอีเมลอัตโนมัติ (ทุกวัน 8:30 น.)
// ========================================
function scheduleDailyEmail() {
    // Cron format: นาที ชั่วโมง วัน เดือน วันในสัปดาห์
    // '30 8 * * *' = ทุกวันเวลา 8:30 น.
    cron.schedule(
        "30 8 * * 1-5",
        async () => {
            console.log(
                "⏰ Running scheduled daily report at",
                new Date().toLocaleString("th-TH")
            );

            try {
                let query = `SELECT email FROM [Export_Alert].[dbo].[master_user] WHERE [status] = 'Active'`;
                let findDB = await mssql.qurey(query);

                const recipients = findDB.recordset.map((row) => row.email);

                // const recipients = [
                //   "sirawit@thaiparker.co.th",
                //   // 'recipient2@company.com',
                // ];

                await sendDailyReport(recipients);
            } catch (error) {
                console.error("Failed to send scheduled email:", error);
            }
        },
        {
            timezone: "Asia/Bangkok", // ตั้งเขตเวลาเป็นเวลาไทย
        }
    );

    console.log("✅ Daily email scheduler started (8:30 AM Bangkok time)");
}

// ========================================
// 9. API Endpoint สำหรับส่งอีเมลด้วยตนเอง
// ========================================
router.post("/03SENDMAIL/sendDailyReport", async (req, res) => {
    try {
        const { recipients } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                error: "กรุณาระบุอีเมลผู้รับอย่างน้อย 1 ที่อยู่",
            });
        }

        const result = await sendDailyReport(recipients);

        return res.status(200).json({
            success: true,
            message: "ส่งอีเมลสำเร็จ",
            messageId: result.messageId,
        });
    } catch (error) {
        console.error("Error in sendDailyReport endpoint:", error);
        return res.status(500).json({
            error: "เกิดข้อผิดพลาดในการส่งอีเมล",
            details: error.message,
        });
    }
});

// ========================================
// 10. API Endpoint สำหรับทดสอบ Email Template
// ========================================
router.get("/03SENDMAIL/previewEmail", async (req, res) => {
    try {
        let query = `WITH R AS ( 
      SELECT  *, 
              ROW_NUMBER() OVER (PARTITION BY po_no ORDER BY user_input_date DESC) AS rn 
      FROM [Export_Alert].[dbo].[data_table]) 
      SELECT TOP 10000 * 
      FROM R 
      WHERE rn = 1 
      ORDER BY user_input_date DESC;`;

        let db = await mssql.qurey(query);

        if (!db["recordsets"] || db["recordsets"].length === 0) {
            return res.status(400).json({ error: "ไม่พบข้อมูลในตาราง" });
        }

        const data = db["recordsets"][0];
        const statusMap = groupDataByStatus(data);
        const htmlContent = generateEmailHTML(statusMap);

        // ส่ง HTML กลับไปแสดงในบราวเซอร์
        res.setHeader("Content-Type", "text/html");
        res.send(htmlContent);
    } catch (error) {
        console.error("Error in previewEmail endpoint:", error);
        return res.status(500).json({
            error: "เกิดข้อผิดพลาดในการสร้าง preview",
            details: error.message,
        });
    }
});

// ========================================
// 11. เริ่มต้นระบบ
// ========================================
// เรียกใช้เมื่อ server เริ่มทำงาน
scheduleDailyEmail();

// Export functions
module.exports = router;
