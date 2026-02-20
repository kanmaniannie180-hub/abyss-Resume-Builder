# 🌌 Abyss — AI Resume & Portfolio Builder

**Abyss** is an AI-powered resume and portfolio builder that helps users create **ATS-optimized resumes**, detect **bias in content**, generate **professional portfolios**, and share profiles using **QR codes**.

It provides **domain-adaptive templates**, intelligent suggestions, and **dual resume versions (Resume Twin)** for role-specific customization.

---

## 🚀 Features

### 🧠 AI Resume Assistant
- Context-aware resume suggestions  
- Domain-specific writing guidance  
- Auto-fill resume from prompts  
- Keyword-based optimization  

---

### 📄 Resume & CV Builder
- Real-time resume editor  
- Live preview panel  
- ATS-friendly formatting  
- PDF export (CV & Resume)  
- Multiple professional templates  

---

### 👥 Resume Twin (A/B Resumes)
Create **two independent resume versions** from one base profile.

Each version includes:
- Role-specific customization  
- Independent templates  
- Separate export  
- Individual QR codes  

---

### 🎨 Domain-Adaptive Templates
Templates automatically adjust:
- Section headers  
- Skills structure  
- Content style  
- Layout emphasis  

**Supported domains**
IT, Management, Arts, Education, Culinary, Music, Sports, Academic, Security, Healthcare, Teaching, Project Management

---

### 🧾 Portfolio Generator
- Auto-generated personal portfolio website  
- Resume data → website sections  
- Profile photo sync  
- Contact actions (Email, WhatsApp, Call)  
- Shareable portfolio link  

---

### 🧪 ATS Optimization Engine
- ATS score calculation  
- Section-wise scoring  
- Keyword density analysis  
- Missing content detection  
- Improvement suggestions  

---

### ⚖️ Bias Detection Engine
- Gender bias detection  
- Age bias detection  
- Subjective language detection  
- Photo bias flag  
- Resume heatmap visualization  

---

### 📊 Career Insights
- Salary estimation by domain  
- Job match suggestions  
- Skill gap insights  
- Domain-specific improvement tips  

---

### 🔗 Sharing & QR
- QR for CV PDF  
- QR for Resume PDF  
- QR for Portfolio  
- Share to LinkedIn  
- Naukri redirect & upload  

---

## 🧩 Architecture

### Frontend
- React  
- Tailwind CSS / CSS Modules  
- Component-based editor  

### AI Layer
- Prompt-driven suggestions  
- Keyword mapping engine  
- Bias detection rules  

### Data
- Local storage persistence  
- Resume A/B state  
- Template metadata  

### Export
- HTML → PDF rendering  
- QR generation  

---

## 🖥️ Application Pages
- Splash / Landing  
- Login / Signup (Google + Email OTP)  
- Dashboard  
- Template Library  
- Resume Editor  
- ATS Analysis  
- Bias Analysis  
- Portfolio Page  
- Outputs & Export  

---

## 🧠 Resume Twin Concept

Abyss supports **parallel resume versions**:

**Resume A** → Example: IT Role  
**Resume B** → Example: Management Role  

Each resume includes:
- Independent template  
- Domain-specific headers  
- Unique skills & experience  
- Separate export  
- Individual QR code  

---

## 🎨 Templates

12 domain-specific templates featuring:
- Unique typography  
- Color themes  
- Layout styles  
- ATS compatibility  
- Optional photo  

**Examples**
- Modern Pro (IT)  
- Executive (Management)  
- Creative Flow (Arts)  
- Minimal Edge (Education)  
- Culinary Craft  
- Sports Elite  
- Healthcare Care  
- Academic Scholar  
- Security Guard  
- Music Harmony  
- Teaching Mentor  
- Project Leader  

---

## 🔍 Domain-Adaptive Resume Structure

Section names change automatically based on profession.

**IT**
- Professional Summary  
- Technical Skills  
- Projects  
- Experience  

**Sports**
- Athletic Profile  
- Sports Skills  
- Competitions  
- Training  

**Culinary**
- Culinary Profile  
- Kitchen Experience  
- Signature Dishes  

---

## 📁 Project Structure

```
src/
  components/
    ResumeEditor/
    Templates/
    ATS/
    Bias/
    Portfolio/
    AI/
    Shared/
  data/
    domainHeaders.js
    templates.js
    suggestions.js
  pages/
    Splash/
    Dashboard/
    Templates/
    Editor/
    Portfolio/
  utils/
    atsEngine.js
    biasEngine.js
    pdfExport.js
    qr.js
```

---

## ⚙️ Setup

```bash
git clone https://github.com/yourusername/abyss
cd abyss
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

---

## 🌐 Deployment

Recommended platforms:
- Vercel  
- Netlify  
- Firebase Hosting  

---

## 🔐 Authentication
- Google login  
- Email OTP verification  
- User profile persistence  

---

## 📤 Export & Sharing
- Generate CV PDF  
- Generate Resume PDF  
- Generate Portfolio  
- QR codes  
- Share to LinkedIn  
- Share to Naukri  

---

## 🤖 AI Capabilities

Abyss AI can:
- Suggest improvements  
- Rewrite sections  
- Auto-fill resume content  
- Generate domain-specific data  
- Detect bias  
- Optimize ATS score  

---

## 📊 ATS Scoring Factors
- Keywords  
- Skills count  
- Experience depth  
- Metrics usage  
- Section completeness  
- Formatting quality  

---

## ⚖️ Bias Detection Types
- Gendered words  
- Age indicators  
- Subjective language  
- Photo bias  
- Exclusionary terms  

---

## 🧭 Roadmap
- Job matching engine  
- Recruiter dashboard  
- Cloud resume hosting  
- Resume analytics  
- AI rewriting  
- Interview preparation AI  

---

## 🏁 Conclusion

**Abyss transforms resume creation into an intelligent, fair, and adaptive experience** by combining AI assistance, ATS optimization, bias detection, and portfolio generation in one unified platform.
