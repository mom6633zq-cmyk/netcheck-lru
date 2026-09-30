# MASTER PROMPT — UX/UI DESIGN + INTERACTIVE PROTOTYPE

ออกแบบระบบ **Web Application สำหรับตรวจสอบคุณภาพเครือข่ายและแจ้งปัญหาอินเทอร์เน็ตภายในมหาวิทยาลัยราชภัฏเลย**

ชื่อระบบ:
**“ระบบตรวจสอบคุณภาพเครือข่ายและแจ้งปัญหาอินเทอร์เน็ตภายในมหาวิทยาลัยราชภัฏเลย”**

สร้าง UI/UX ระดับพร้อมนำไปพัฒนาเป็นเว็บไซต์จริง และสร้าง Interactive Prototype ที่สามารถกดเชื่อมโยงระหว่างหน้าต่าง ๆ ได้

---

# 1. เป้าหมายของระบบ

ระบบมีเป้าหมายเพื่อให้:

### ผู้ใช้งาน

* นักศึกษา
* บุคลากร
* ผู้ใช้งานอินเทอร์เน็ตภายในมหาวิทยาลัย

สามารถ:

1. เข้าสู่ระบบ
2. ตรวจสอบคุณภาพเครือข่าย
3. ดูค่า Download Speed
4. ดูค่า Upload Speed
5. ดูค่า Ping
6. แจ้งปัญหาอินเทอร์เน็ต
7. แนบรูปภาพปัญหา
8. ระบุอาคารและพื้นที่
9. ติดตามสถานะการแจ้งปัญหา
10. ดูประวัติการแจ้งปัญหา

### เจ้าหน้าที่

สามารถ:

1. ดู Dashboard
2. ดูรายการแจ้งปัญหาทั้งหมด
3. ค้นหาและกรองปัญหา
4. ดูรายละเอียด Ticket
5. รับเรื่อง
6. เปลี่ยนสถานะ
7. เพิ่มรายละเอียดการแก้ไข
8. ดูประวัติการดำเนินงาน
9. วิเคราะห์ข้อมูลปัญหาแยกตามพื้นที่ ประเภทปัญหา และช่วงเวลา

---

# 2. Visual Design

สไตล์:
**Modern + Minimal + Professional + Technology**

ไม่ต้องทำให้ดูหรูหรือแฟนซีเกินไป

ใช้:

* พื้นหลังสีขาวหรือเทาอ่อน
* Primary Color: น้ำเงิน
* Secondary Color: ฟ้า
* สีเขียวสำหรับสถานะปกติ/แก้ไขแล้ว
* สีเหลืองสำหรับกำลังดำเนินการ
* สีแดงสำหรับปัญหา/ข้อผิดพลาด
* Text สีเข้ม
* Border สีอ่อน
* Shadow แบบ subtle

Typography:

* ใช้ **Noto Sans Thai** หรือ **Prompt**
* หัวข้อชัดเจน
* Body text อ่านง่าย
* รองรับภาษาไทยทั้งหมด

Border Radius:

* Card: 12–16px
* Button: 8–10px
* Input: 8–10px

ใช้ระบบ Grid และ Auto Layout อย่างเป็นระเบียบ

---

# 3. Desktop Layout

ออกแบบ Desktop ขนาดหลัก:
**1440 × 1024 px**

สำหรับ User:

* Top Navbar
* Main Content
* Container กว้างประมาณ 1200px

สำหรับ Admin:

* Sidebar ซ้ายกว้างประมาณ 240px
* Main Content อยู่ด้านขวา
* Top Header ภายใน Main Content

---

# 4. MOBILE RESPONSIVE

ออกแบบ Mobile:
**390 × 844 px**

เมื่อหน้าจอเล็ก:

* Sidebar เปลี่ยนเป็น Hamburger Menu
* Card เรียงแนวตั้ง
* Table เปลี่ยนเป็น Card/List
* ปุ่มเต็มความกว้างเมื่อเหมาะสม
* Form ต้องใช้งานด้วยมือเดียวได้ง่าย
* Navigation ต้องไม่แน่นเกินไป

สร้าง Responsive Layout ให้ Desktop และ Mobile มีโครงสร้างเดียวกัน

---

# 5. USER FLOW

สร้าง Prototype Flow สำหรับผู้ใช้งานดังนี้:

Login
↓
Dashboard
↓
เลือก “ตรวจสอบเครือข่าย”
↓
Network Test
↓
ผลการตรวจสอบ
↓
Dashboard

หรือ

Dashboard
↓
“แจ้งปัญหา”
↓
กรอกข้อมูล
↓
แนบรูป
↓
ยืนยันการแจ้ง
↓
Success
↓
รายละเอียด Ticket
↓
ติดตามสถานะ

หรือ

Dashboard
↓
ประวัติการแจ้งปัญหา
↓
เลือก Ticket
↓
รายละเอียด
↓
Timeline สถานะ

---

# 6. ADMIN FLOW

Admin Login
↓
Admin Dashboard
↓
รายการแจ้งปัญหา
↓
เลือก Ticket
↓
รายละเอียดปัญหา
↓
รับเรื่อง
↓
กำลังดำเนินการ
↓
บันทึกการแก้ไข
↓
แก้ไขแล้ว
↓
ปิดงาน

และ

Admin Dashboard
↓
Analytics
↓
Filter
↓
ดูกราฟและสถิติ

---

# 7. PAGE 01 — LOGIN

Frame:
1440 × 1024

Layout:
แบ่งหน้าจอ 2 ส่วน

ด้านซ้าย:

* Logo
* ชื่อระบบ
* ข้อความสั้น ๆ เช่น
  “ตรวจสอบคุณภาพเครือข่ายและแจ้งปัญหาอินเทอร์เน็ตภายในมหาวิทยาลัย”

ด้านขวา:
Login Card กว้างประมาณ 420px

องค์ประกอบ:

* Heading: “เข้าสู่ระบบ”
* Subtitle: “เข้าสู่ระบบเพื่อใช้งานระบบเครือข่าย”
* Input Email / Username
* Input Password
* Show Password Icon
* Remember Me
* ปุ่ม “เข้าสู่ระบบ”
* Link “ลืมรหัสผ่าน?”

Prototype:
กด Login → Dashboard

สร้าง Error State:

* Email ไม่ถูกต้อง
* Password ไม่ถูกต้อง
* แสดง Error Message ใต้ Input

---

# 8. PAGE 02 — USER DASHBOARD

Navbar:
ซ้าย:

* Logo
* ชื่อระบบ

เมนู:

* Dashboard
* ตรวจสอบเครือข่าย
* แจ้งปัญหา
* ประวัติการแจ้งปัญหา

ขวา:

* Notification
* Profile Avatar
* ชื่อผู้ใช้งาน
* Dropdown

Main Content:

Heading:
“สวัสดี 👋”
“ตรวจสอบสถานะเครือข่ายของคุณได้ที่นี่”

Summary Cards 4 ใบ:

Card 1:
สถานะเครือข่าย
“เชื่อมต่อปกติ”

Card 2:
Download
“100 Mbps”

Card 3:
Upload
“50 Mbps”

Card 4:
Ping
“20 ms”

ใต้ Cards:

Section:
“การดำเนินการด่วน”

Button/Card:

* ตรวจสอบเครือข่าย
* แจ้งปัญหา

Section:
“การแจ้งปัญหาล่าสุด”

แสดง 3 รายการ:

* Ticket ID
* อาคาร
* ประเภทปัญหา
* วันที่
* Status Badge

ด้านขวาหรือด้านล่าง:
“สถานะการแจ้งปัญหา”

แสดงจำนวน:

* รอตรวจสอบ
* กำลังดำเนินการ
* แก้ไขแล้ว

Prototype:
กด “ตรวจสอบเครือข่าย” → Network Test
กด “แจ้งปัญหา” → Report Issue
กด Ticket → Ticket Detail

---

# 9. PAGE 03 — NETWORK TEST

Heading:
“ตรวจสอบคุณภาพเครือข่าย”

คำอธิบาย:
“ตรวจสอบความเร็วและคุณภาพการเชื่อมต่ออินเทอร์เน็ต”

ด้านบน:
Connection Status Card

แสดง:
🟢 เชื่อมต่ออินเทอร์เน็ตปกติ

ตรงกลาง:
สร้าง Speed Test Visualization

แสดงตัวเลขใหญ่:
Download
“100 Mbps”

Upload
“50 Mbps”

Ping
“20 ms”

สร้าง Gauge หรือ Circular Progress ที่ดูทันสมัย

ด้านล่าง:
ข้อมูลเพิ่มเติม:

* IP Address
* Connection Type
* วันที่ตรวจสอบ
* เวลา

ปุ่มหลัก:
“เริ่มตรวจสอบเครือข่าย”

Prototype Interaction:

State 1:
พร้อมตรวจสอบ

กดปุ่ม →

State 2:
กำลังตรวจสอบ
แสดง Loading Animation
ข้อความ:
“กำลังตรวจสอบคุณภาพเครือข่าย...”

จากนั้น →

State 3:
ตรวจสอบเสร็จสิ้น

แสดงผล:
Download / Upload / Ping

และข้อความ:
“คุณภาพเครือข่ายอยู่ในระดับดี”

---

# 10. PAGE 04 — REPORT ISSUE

Heading:
“แจ้งปัญหาอินเทอร์เน็ต”

สร้าง Form Card

Field 1:
อาคาร
Dropdown

ตัวอย่าง:

* อาคารเรียน
* อาคารสำนักงาน
* ห้องสมุด
* หอพัก
* อื่น ๆ

Field 2:
พื้นที่ / ห้อง
Text Input

Field 3:
ประเภทปัญหา
Dropdown

ตัวเลือก:

* อินเทอร์เน็ตช้า
* เชื่อมต่ออินเทอร์เน็ตไม่ได้
* Wi-Fi ไม่เสถียร
* สัญญาณอ่อน
* อื่น ๆ

Field 4:
รายละเอียดปัญหา
Textarea

Field 5:
แนบรูปภาพ

Upload Box:
“ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์”

แสดง Preview Image หลัง Upload

ด้านล่าง:
Checkbox:
“ข้อมูลที่แจ้งมีความถูกต้อง”

Button:
“ส่งเรื่องแจ้งปัญหา”

Prototype:
กด Submit →
Confirmation Modal

Modal:
“ยืนยันการแจ้งปัญหา?”

ปุ่ม:
ยกเลิก / ยืนยัน

กดยืนยัน →
Success Screen

ข้อความ:
“แจ้งปัญหาสำเร็จ”

แสดง:
Ticket ID
วันที่แจ้ง
สถานที่

Button:
“ดูรายละเอียด”

---

# 11. PAGE 05 — REPORT SUCCESS

สร้าง Success Page

ตรงกลาง:
Success Icon

Heading:
“แจ้งปัญหาสำเร็จ”

ข้อความ:
“เจ้าหน้าที่ได้รับข้อมูลของคุณแล้ว”

Card:
Ticket ID: #NET-0001
สถานที่: อาคารตัวอย่าง
ประเภท: อินเทอร์เน็ตช้า
สถานะ: รอตรวจสอบ

Buttons:
“ดูรายละเอียด”
“กลับหน้าหลัก”

---

# 12. PAGE 06 — ISSUE HISTORY

Heading:
“ประวัติการแจ้งปัญหา”

ด้านบน:
Search Bar
“ค้นหา Ticket หรือสถานที่...”

Filter:

* อาคาร
* ประเภทปัญหา
* สถานะ
* วันที่

Desktop:
ใช้ Table

Columns:
Ticket ID
วันที่
อาคาร
พื้นที่
ประเภทปัญหา
สถานะ
Action

Status:
รอตรวจสอบ
กำลังดำเนินการ
แก้ไขแล้ว
ปิดงาน

Mobile:
เปลี่ยน Table เป็น Issue Cards

Prototype:
กดรายการ → Issue Detail

---

# 13. PAGE 07 — ISSUE DETAIL USER

Heading:
“รายละเอียดการแจ้งปัญหา”

Top Card:

Ticket:
#NET-0001

Status:
กำลังดำเนินการ

ข้อมูล:

* วันที่แจ้ง
* อาคาร
* พื้นที่
* ประเภทปัญหา
* รายละเอียด
* รูปภาพ

สร้าง Timeline ใหญ่:

● แจ้งปัญหา
วันที่และเวลา

│

● รับเรื่อง
วันที่และเวลา

│

● กำลังดำเนินการ
วันที่และเวลา

│

○ แก้ไขแล้ว

ด้านล่าง:
“รายละเอียดจากเจ้าหน้าที่”

แสดงข้อความจากเจ้าหน้าที่

ปุ่ม:
“กลับไปประวัติ”

---

# 14. PAGE 08 — ADMIN DASHBOARD

ใช้ Admin Layout

Sidebar:

Logo

เมนู:
Dashboard
รายการแจ้งปัญหา
Analytics
ประวัติการดำเนินงาน
จัดการผู้ใช้งาน
ตั้งค่าระบบ

ด้านล่าง:
Profile
Logout

Main Content:

Heading:
“Dashboard”

Subtitle:
“ภาพรวมปัญหาเครือข่ายภายในมหาวิทยาลัย”

Summary Cards:

1. ปัญหาทั้งหมด
   “128”

2. รอตรวจสอบ
   “24”

3. กำลังดำเนินการ
   “35”

4. แก้ไขแล้ว
   “69”

ส่วน Charts:

Chart 1:
“จำนวนปัญหาในแต่ละเดือน”
Line Chart

Chart 2:
“ปัญหาแยกตามประเภท”
Doughnut Chart

Chart 3:
“ปัญหาแยกตามอาคาร”
Bar Chart

Section:
“รายการแจ้งปัญหาล่าสุด”

Table:
Ticket
วันที่
อาคาร
ประเภท
สถานะ
ผู้รับผิดชอบ
Action

---

# 15. PAGE 09 — ADMIN ISSUE MANAGEMENT

Heading:
“จัดการรายการแจ้งปัญหา”

Top:
Search Bar

Filter Row:

* อาคาร
* ประเภท
* สถานะ
* ช่วงวันที่

Button:
“Export”

Table:

Ticket ID
วันที่แจ้ง
ผู้แจ้ง
อาคาร
พื้นที่
ประเภท
สถานะ
เจ้าหน้าที่
Action

Action Menu:

* ดูรายละเอียด
* รับเรื่อง
* เปลี่ยนสถานะ
* แก้ไข

สร้าง Pagination

---

# 16. PAGE 10 — ADMIN ISSUE DETAIL

Heading:
“รายละเอียด Ticket #NET-0001”

แบ่ง Layout เป็น 2 Columns

ซ้าย:
ข้อมูลผู้แจ้ง

* ชื่อ
* Email
* เบอร์โทรศัพท์

ข้อมูลปัญหา:

* อาคาร
* พื้นที่
* ประเภท
* รายละเอียด
* รูปภาพ

ขวา:
Status Card

สถานะปัจจุบัน:
“กำลังดำเนินการ”

Dropdown:
เปลี่ยนสถานะ

ตัวเลือก:

* รอตรวจสอบ
* กำลังดำเนินการ
* แก้ไขแล้ว
* ปิดงาน

Textarea:
“รายละเอียดการแก้ไข”

Button:
“บันทึกการดำเนินงาน”

ด้านล่าง:
Timeline

แสดงประวัติ:
แจ้งปัญหา
รับเรื่อง
กำลังดำเนินการ
แก้ไขแล้ว

---

# 17. PAGE 11 — ANALYTICS

Heading:
“วิเคราะห์ข้อมูลเครือข่าย”

ด้านบน Filter:

วันที่เริ่มต้น
วันที่สิ้นสุด
อาคาร
ประเภทปัญหา

Button:
“ค้นหา”

Summary:

* ปัญหาทั้งหมด
* ปัญหาที่แก้ไขแล้ว
* ปัญหาที่ยังดำเนินการ
* เวลาเฉลี่ยในการแก้ไข

Charts:

1. จำนวนปัญหาแต่ละเดือน
   Line Chart

2. ปัญหาแยกตามอาคาร
   Bar Chart

3. ประเภทปัญหา
   Doughnut Chart

4. ระยะเวลาเฉลี่ยในการแก้ไข
   Bar Chart

สร้าง Insight Card:

“อาคารที่พบปัญหามากที่สุด”
“ประเภทปัญหาที่พบบ่อยที่สุด”

ออกแบบให้เจ้าหน้าที่สามารถนำข้อมูลไปใช้ประกอบการวางแผนปรับปรุงระบบเครือข่ายได้

---

# 18. PAGE 12 — USER PROFILE

Heading:
“โปรไฟล์”

Profile Card:
Avatar
ชื่อผู้ใช้งาน
ประเภทผู้ใช้งาน

ข้อมูล:

* ชื่อ
* รหัสนักศึกษา / รหัสบุคลากร
* Email
* เบอร์โทรศัพท์

Buttons:
“แก้ไขข้อมูล”
“เปลี่ยนรหัสผ่าน”

---

# 19. PAGE 13 — NOTIFICATION

สร้าง Notification Dropdown

ตัวอย่าง:

🔵 Ticket #NET-0001
เจ้าหน้าที่รับเรื่องแจ้งปัญหาของคุณแล้ว

🟡 Ticket #NET-0002
กำลังดำเนินการแก้ไข

🟢 Ticket #NET-0003
แก้ไขปัญหาเรียบร้อยแล้ว

แต่ละ Notification สามารถกดเพื่อไป Issue Detail

---

# 20. COMPONENTS

สร้าง Figma Components พร้อม Variants:

Button:

* Primary
* Secondary
* Outline
* Danger
* Disabled
* Loading

Input:

* Default
* Focus
* Error
* Disabled
* Success

Status Badge:

* Pending
* In Progress
* Resolved
* Closed
* Error

Card:

* Default
* Network
* Statistic
* Ticket

Modal:

* Confirmation
* Success
* Error

Table:

* Header
* Row
* Hover
* Selected

สร้าง:

* Navbar
* Sidebar
* Dropdown
* Search
* Filter
* Pagination
* Upload
* Timeline
* Toast
* Alert
* Loading
* Empty State

ใช้ Auto Layout กับ Components ทั้งหมด

---

# 21. EMPTY / ERROR / LOADING STATES

ต้องออกแบบ State เหล่านี้ด้วย

Empty:
“ยังไม่มีรายการแจ้งปัญหา”

Error:
“ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง”

Network Error:
“ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้”

Loading:
“กำลังโหลดข้อมูล...”

Success:
“ดำเนินการสำเร็จ”

---

# 22. PROTOTYPE CONNECTION

สร้าง Prototype ให้กดใช้งานได้จริง

### USER

Login
→ Dashboard

Dashboard
→ Network Test

Dashboard
→ Report Issue

Dashboard
→ Issue History

Dashboard
→ Profile

Network Test
→ Testing State
→ Result State

Report Issue
→ Confirmation Modal
→ Success
→ Issue Detail

Issue History
→ Issue Detail

Notification
→ Issue Detail

### ADMIN

Admin Login
→ Admin Dashboard

Dashboard
→ Issue Management

Dashboard
→ Analytics

Issue Management
→ Issue Detail

Issue Detail
→ Change Status
→ Save
→ Updated Status

Analytics
→ Filter
→ Updated Chart State

---

# 23. INTERACTION STYLE

ใช้ Prototype Interaction แบบ:

* On Click
* Navigate To
* Open Overlay
* Close Overlay
* Change To
* Smart Animate เมื่อเหมาะสม

Transition:

* 200–300ms
* ใช้ Ease In/Out
* ไม่ใช้ Animation เยอะจนรบกวนการใช้งาน

Button ทุกปุ่มที่มี Action ต้องสามารถกดได้

Menu ทุกเมนูต้องเชื่อมไปยังหน้าที่เกี่ยวข้อง

---

# 24. FIGMA FILE STRUCTURE

จัดหน้าใน Figma เป็น:

01 — Cover
02 — Design System
03 — User Flow
04 — User Desktop
05 — User Mobile
06 — Admin Desktop
07 — Admin Mobile
08 — Components
09 — Prototype

ตั้งชื่อ Frame ให้ชัดเจน เช่น:

USER / Login
USER / Dashboard
USER / Network Test
USER / Report Issue
USER / Issue History
USER / Issue Detail
USER / Profile

ADMIN / Dashboard
ADMIN / Issue Management
ADMIN / Issue Detail
ADMIN / Analytics

---

# 25. IMPORTANT DESIGN REQUIREMENTS

อย่าออกแบบเป็น Landing Page หรือเว็บไซต์ประชาสัมพันธ์

นี่คือ **ระบบ Web Application สำหรับใช้งานจริง**

เน้น:

* UX ที่เข้าใจง่าย
* Navigation ชัดเจน
* ลดจำนวนขั้นตอน
* ข้อมูลอ่านง่าย
* Dashboard มีประโยชน์
* Form ใช้งานง่าย
* Status เห็นชัด
* รองรับภาษาไทย
* Responsive
* Accessibility
* Consistent Design System

อย่าใส่ฟังก์ชันที่ไม่เกี่ยวข้องกับระบบ เช่น Social Media, Chat, Shopping, Payment หรือระบบอื่นที่ไม่เกี่ยวข้อง

สร้าง Mock Data ที่สมจริงเพื่อให้ Prototype ดูเหมือนระบบที่ใช้งานจริง

ผลลัพธ์สุดท้ายต้องเป็น **High-Fidelity UX/UI Design พร้อม Interactive Prototype** สำหรับนำไปนำเสนออาจารย์และใช้เป็นต้นแบบในการพัฒนาเว็บไซต์จริง
