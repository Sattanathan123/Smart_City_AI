import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "vbsattanathan@gmail.com"
APP_PASSWORD = "vhargatmypmqcwxl"
RECIPIENT_EMAIL = "vbsattanathan@gmail.com"

msg = MIMEMultipart()
msg["From"] = SENDER_EMAIL
msg["To"] = RECIPIENT_EMAIL
msg["Subject"] = "🚨 [Smart City AI] Gmail SMTP Verification Test"

body = """
====================================================
SMART CITY AI PLATFORM — SMTP VERIFICATION ALERT
====================================================

Hello Admin,

This is a test notification confirming that Gmail SMTP integration
is working properly for vbsattanathan@gmail.com!

System Status: ONLINE
AI Conflict Detection Engine: ACTIVE
ML Microservice: CONNECTED

----------------------------------------------------
http://localhost:8080/
"""

msg.attach(MIMEText(body, "plain"))

try:
    print(f"--> Connecting to {SMTP_SERVER}:{SMTP_PORT}...")
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    print("--> Authenticating with Gmail App Password...")
    server.login(SENDER_EMAIL, APP_PASSWORD)
    print(f"--> Sending test email to {RECIPIENT_EMAIL}...")
    server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    server.quit()
    print("\n[SUCCESS] SMTP Email sent successfully to vbsattanathan@gmail.com! Please check your Gmail Inbox.")
except Exception as e:
        print(f"\n[ERROR] Failed to send email: {e}")
