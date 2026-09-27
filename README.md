# 🧠 MindScore AI

### Student Mental Health Score Prediction System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-MindScore%20AI-success?style=for-the-badge)](https://mindscore-ai-w3t7.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square\&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square\&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square\&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square\&logo=vite)](https://vite.dev/)
[![Scikit--learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=flat-square\&logo=scikit-learn)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange?style=flat-square)](https://xgboost.readthedocs.io/)

> **MindScore AI** is a machine-learning web application that predicts a student's mental health score from demographic information, social-media usage, study habits, physical activity, sleep, and self-reported stress level.

### 🌐 Live Application

**[Open MindScore AI →](https://mindscore-ai-w3t7.onrender.com)**

---

## 📌 Project Overview

Students' mental well-being can be influenced by multiple behavioral and lifestyle factors.

This project uses a **regression-based machine learning approach** to estimate a numerical `Mental_Health_Score` from student information and daily habits.

The project covers the complete machine-learning lifecycle:

```text
Data Collection
      ↓
Data Understanding
      ↓
Data Cleaning
      ↓
Exploratory Data Analysis
      ↓
Feature Engineering
      ↓
Preprocessing
      ↓
Model Training
      ↓
Model Comparison
      ↓
Hyperparameter Tuning
      ↓
Model Evaluation
      ↓
Model Serialization
      ↓
FastAPI Backend
      ↓
React Frontend
      ↓
Deployment
```

---

# 🎯 Objective

The primary objective is to build an end-to-end ML application that can:

* Accept student demographic information
* Analyze social-media usage patterns
* Consider study and lifestyle habits
* Consider sleep and physical activity
* Consider self-reported stress level
* Process the input using the trained ML pipeline
* Predict a numerical mental-health score
* Display the prediction through an interactive web interface

> **Important:** This project is an educational machine-learning prediction system. It is not a medical or clinical diagnostic tool.

---

# 📊 Dataset

The project uses:

```text
Student Social Media And Mental Health Impact.csv
```

The dataset contains **5,000 records** and **13 columns**, with:

```text
Mental_Health_Score
```

as the target variable.

The prediction problem is therefore treated as a:

### Regression Problem

The model predicts a continuous numerical score rather than a class label.

---

# 🧾 Input Features

The deployed application collects the following information.

| Feature                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| Age                       | Student age                                   |
| Gender                    | Male / Female                                 |
| Country                   | Student's country                             |
| Academic Level            | High School / Undergraduate / Graduate        |
| Most Used Platform        | Primary social-media platform                 |
| Purpose of Use            | Networking / Education / Entertainment / News |
| Average Daily Usage Hours | Daily social-media usage                      |
| Daily Unlocks             | Approximate phone unlocks per day             |
| Study Hours               | Daily study duration                          |
| Physical Activity Hours   | Daily physical activity                       |
| Sleep Hours Per Night     | Average nightly sleep                         |
| Stress Level              | Low / Medium / High / Very High               |
| Grouped Country           | Engineered country grouping used by the model |

---

# 🤖 Machine Learning Approach

Multiple regression models were trained and evaluated on the same test data.

The project compared **five model configurations**:

1. Linear Regression
2. Random Forest — Default
3. Random Forest — Tuned
4. XGBoost — Default
5. XGBoost — Tuned

## Model Comparison

| Model                   |         R² |        MAE |       RMSE |
| ----------------------- | ---------: | ---------: | ---------: |
| Linear Regression       |     0.7398 |     0.5362 |     0.6760 |
| Random Forest — Default |     0.8776 |     0.3472 |     0.4637 |
| Random Forest — Tuned   |     0.8650 |     0.3689 |     0.4869 |
| XGBoost — Default       |     0.8772 |     0.3519 |     0.4645 |
| **XGBoost — Tuned**     | **0.8863** | **0.3348** | **0.4469** |

### Evaluation Metrics

**R² Score**

Measures how much of the variance in the target variable is explained by the model.

**MAE — Mean Absolute Error**

Measures the average absolute difference between the actual and predicted scores.

**RMSE — Root Mean Squared Error**

Measures prediction error while giving greater weight to larger errors.

---

# 🚀 Model Selection

The models were compared using:

* R²
* MAE
* RMSE

The tuned XGBoost configuration achieved the strongest test-set metrics in the notebook:

```text
R²   = 0.886269
MAE  = 0.334787
RMSE = 0.446939
```

The selected model is saved as:

```text
Mental_Health_Model.pkl
```

The saved object contains the trained preprocessing/model pipeline so that the backend can receive raw user inputs and pass them directly to the model.

---

# 🔧 Feature Engineering & Preprocessing

The project performs preprocessing before model prediction.

One engineered feature is:

```text
Grouped_country
```

Countries outside the selected major-country groups are mapped to:

```text
Other
```

This same preprocessing logic is also applied when the API receives a prediction request.

The purpose of saving the pipeline rather than only the raw estimator is to keep the preprocessing and prediction process consistent between training and deployment.

---

# 🧠 Why XGBoost?

XGBoost was evaluated because it is a powerful gradient-boosting algorithm for structured/tabular data.

The project also performed hyperparameter tuning rather than relying only on the default XGBoost configuration.

The tuned model was then evaluated against the other trained models using the same test set.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │     React + Vite     │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP POST
                               │ /predict
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Mental_Health_Model  │
                    │       .pkl           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Tuned XGBoost Model  │
                    │    + Preprocessing   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Mental Health Score  │
                    └──────────────────────┘
```

---

# 🖥️ Frontend

The frontend is built using:

* React
* Vite
* JavaScript
* CSS

The interface contains a multi-step prediction form.

### Step 1 — About You

Collects:

* Age
* Gender
* Country
* Academic level

### Step 2 — Platform Use

Collects:

* Most-used platform
* Purpose of use
* Average daily usage
* Phone unlocks

### Step 3 — Daily Life

Collects:

* Study hours
* Physical activity
* Sleep
* Stress level

After submission, the frontend sends the data to the FastAPI `/predict` endpoint.

The returned prediction is then displayed using an animated score gauge.

---

# ⚡ Backend

The backend is built using **FastAPI**.

### Main responsibilities

* API endpoint creation
* Request validation
* Input preprocessing
* Model loading
* Prediction
* JSON response generation
* CORS configuration

The model is loaded using:

```python
model = joblib.load("Mental_Health_Model.pkl")
```

The prediction endpoint is:

```text
POST /predict
```

The API receives student information and returns:

```json
{
  "predicted_mental_health_score": 7.42
}
```

---

# 🔌 API Example

### Endpoint

```text
POST /predict
```

### Example Request

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.0,
  "daily_unlocks": 60,
  "study_hours": 3.0,
  "physical_activity_hours": 1.0,
  "sleep_hours_per_night": 7.0,
  "stress_level": "Medium"
}
```

### Example Response

```json
{
  "predicted_mental_health_score": 7.42
}
```

---

# 📁 Project Structure

```text
MindScore-AI/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── ML_Project.ipynb
├── Student Social Media And Mental Health Impact.csv
├── Mental_Health_Model.pkl
├── main.py
├── requirements.txt
├── setup.bat
├── .gitignore
└── README.md
```

---

# 🧪 Local Installation

## 1. Clone the repository

```bash
git clone https://github.com/fardinkhan-genai/MindScore-AI.git
```

```bash
cd MindScore-AI
```

---

# 🐍 Backend Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn main:app --reload
```

Backend will normally run at:

```text
http://127.0.0.1:8000
```

---

# ⚛️ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL, normally:

```text
http://localhost:5173
```

---

# 🌐 Deployment

The project frontend is deployed on **Render**.

### Live Application

**https://mindscore-ai-w3t7.onrender.com**

Render supports React/Vite applications as static sites and provides a unique `onrender.com` URL. Linked repositories can also automatically redeploy when changes are pushed to the configured branch.

For a Vite frontend, the typical Render configuration is:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Render's current documentation lists `dist` as the standard output directory for Vite static sites.

---

# 🔄 Prediction Flow

When a user clicks **Get My Score**:

```text
1. User enters information
          ↓
2. React validates the form
          ↓
3. React creates JSON payload
          ↓
4. POST /predict
          ↓
5. FastAPI validates request using Pydantic
          ↓
6. Country grouping is performed
          ↓
7. Input is converted into a DataFrame
          ↓
8. Saved ML pipeline receives the input
          ↓
9. Tuned XGBoost generates prediction
          ↓
10. FastAPI returns JSON
          ↓
11. React receives the score
          ↓
12. Score is displayed in the dashboard
```

---

# 🛡️ Validation & Error Handling

The FastAPI backend validates important input ranges.

Examples:

```text
Age: 10–100
Daily usage: 0–24 hours
Study hours: 0–24 hours
Physical activity: 0–24 hours
Sleep: 0–24 hours
Daily unlocks: >= 0
```

Categorical fields are also restricted to expected values using Pydantic `Literal` validation.

The frontend handles API errors and displays an error state if prediction fails.

---

# 📈 What I Learned From This Project

This project helped me practice an end-to-end Data Science workflow:

### Machine Learning

* Regression
* Train/Test Split
* Feature Engineering
* Categorical Encoding
* Model Evaluation
* Random Forest
* XGBoost
* Hyperparameter Tuning
* Model Comparison
* Model Serialization

### Python

* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib
* Matplotlib / Seaborn

### Backend

* FastAPI
* Pydantic
* REST API
* CORS
* JSON
* Model serving

### Frontend

* React
* Vite
* JavaScript
* Form handling
* API integration
* State management
* Responsive UI

### Deployment

* Git
* GitHub
* Render
* Frontend deployment
* Backend deployment

---

# 🎓 Interview Explanation

### Short version

> **MindScore AI is an end-to-end machine learning regression project that predicts a student's mental health score based on demographic information, social-media usage, study habits, physical activity, sleep, and stress level. I performed data preprocessing and feature engineering, trained and compared five regression model configurations, including Linear Regression, Random Forest and XGBoost variants. After evaluation and hyperparameter tuning, the tuned XGBoost configuration achieved an R² of 0.8863, MAE of 0.3348 and RMSE of 0.4469 on the test set. I serialized the trained pipeline using Joblib, built a FastAPI backend for real-time predictions, developed a React/Vite frontend, and deployed the application using Render.**

---

# ⚠️ Disclaimer

MindScore AI is an **educational machine-learning project**.

The predicted score is a statistical model output and:

* is not a medical diagnosis
* should not be used as a clinical assessment
* should not replace professional mental-health advice
* should not be used for medical decision-making

---

# 👨‍💻 Author

### Fardin Khan

**Data Science | Machine Learning | Generative AI | Full Stack Development**

GitHub:
https://github.com/fardinkhan-genai

---

# ⭐ If You Like This Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🚀 Future Improvements

Potential future improvements include:

* Model monitoring
* Prediction history
* User authentication
* Database integration
* Model explainability using SHAP
* Feature importance visualization
* Better model calibration
* Automated model retraining
* Experiment tracking
* MLflow integration
* CI/CD pipeline
* Improved accessibility
* Mobile-responsive enhancements

---

### Live Demo

**👉 https://mindscore-ai-w3t7.onrender.com**
