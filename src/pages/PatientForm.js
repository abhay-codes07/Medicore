import React, { useState, useEffect } from "react";
import axios from 'axios';
import './PatientForm.css';

const PatientForm = () => {
  const steps = ['personal', 'medical', 'symptoms', 'appointment'];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    maritalStatus: "",
    contactNumber: "",
    emergencyContact: "",
    address: "",
    bloodPressure: "",
    sugarLevel: "",
    weight: "",
    heart_rate: "",
    temperature: "",
    diseaseType: "",
    bloodSample: false,
    previousReport: "",
    symptoms: {
      chestPain: false,
      headache: false,
      abdominalPain: false,
      difficultyBreathing: false,
      unconscious: false,
      strokeSymptoms: false,
      fracture: false,
      burnInjury: false,
      fever: false,
      nausea: false
    },
    opdSlot: "",
    tokenNumber: Math.floor(1000 + Math.random() * 9000).toString()
  });

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisWindow, setAnalysisWindow] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const opdSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ];

  const symptomGroups = {
    "Pain Symptoms": [
      "chestPain",
      "headache",
      "abdominalPain",
    ],
    "Urgent Symptoms": [
      "difficultyBreathing",
      "unconscious",
      "strokeSymptoms",
    ],
    "Injury Symptoms": [
      "fracture",
      "burnInjury",
    ],
    "General Symptoms": [
      "fever",
      "nausea",
    ],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "bloodSample") {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          symptoms: { ...prev.symptoms, [name]: checked },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const moveToNextStep = () => {
    const currentStepIndex = steps.indexOf(currentStep);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const moveToPreviousStep = () => {
    const currentStepIndex = steps.indexOf(currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case "personal":
        return formData.name && formData.age && formData.gender && formData.contactNumber && formData.emergencyContact && formData.address;
      case "medical":
        return true;
      case "symptoms":
        return true;
      case "appointment":
        return formData.opdSlot;
      default:
        return false;
    }
  };

  const generateVitalSignsHtml = (formData) => {
    return `
      <div class="vitals-strip">
        <div class="vital-card">
          <div class="vital-icon">🫀</div>
          <div class="vital-label">BP</div>
          <div class="vital-value">${formData.bloodPressure || '-'}</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">🩸</div>
          <div class="vital-label">Sugar</div>
          <div class="vital-value">${formData.sugarLevel || '-'} mg/dL</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">💓</div>
          <div class="vital-label">Heart Rate</div>
          <div class="vital-value">${formData.heart_rate || '-'} bpm</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">🌡️</div>
          <div class="vital-label">Temp</div>
          <div class="vital-value">${formData.temperature || '-'}°F</div>
        </div>
        <div class="vital-card">
          <div class="vital-icon">⚖️</div>
          <div class="vital-label">Weight</div>
          <div class="vital-value">${formData.weight || '-'} kg</div>
        </div>
      </div>
    `;
  };

  const generateReportHtml = (formData, departmentResponse, severityResponse, analysisResponse) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Medical Analysis - Patient #${formData.tokenNumber}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: #f0f9ff;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .token-banner {
            background: #1e40af;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-weight: 500;
          }
          .report-title {
            color: #1e40af;
            margin: 0 0 0.5rem;
          }
          .report-datetime {
            color: #64748b;
            margin-bottom: 2rem;
          }
          .patient-summary {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .summary-item {
            display: flex;
            gap: 0.5rem;
          }
          .summary-label {
            color: #64748b;
            font-weight: 500;
            min-width: 140px;
          }
          .department-severity {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .department-badge {
            background: #1e40af;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-weight: 500;
          }
          .severity-badge {
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-weight: 500;
          }
          .severity-critical { background: #fee2e2; color: #991b1b; }
          .severity-severe { background: #fef3c7; color: #92400e; }
          .severity-moderate { background: #e0f2fe; color: #075985; }
          .severity-mild { background: #d1fae5; color: #065f46; }
          .vitals-strip {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin: 1.5rem 0;
          }
          .vital-card {
            flex: 1;
            text-align: center;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .vital-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .vital-label {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
          }
          .vital-value {
            color: #1e40af;
            font-size: 1.25rem;
            font-weight: 600;
          }
          .symptoms-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
          }
          .symptom-tag {
            background: #e0f2fe;
            color: #075985;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
          }
          .medical-history {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
          }
          .history-item {
            margin-bottom: 1rem;
          }
          .history-label {
            color: #64748b;
            font-weight: 500;
            margin-bottom: 0.25rem;
          }
          .section-title {
            color: #1e40af;
            margin: 2rem 0 1rem;
            font-size: 1.25rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="token-banner">Patient Token: #${formData.tokenNumber}</div>
          
          <h1 class="report-title">Medical Analysis Report</h1>
          <p class="report-datetime">Generated on: ${new Date().toLocaleString()}</p>

          <div class="patient-summary">
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Name:</span>
                <span>${formData.name}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Age/Gender:</span>
                <span>${formData.age}/${formData.gender}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Contact:</span>
                <span>${formData.contactNumber}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Emergency Contact:</span>
                <span>${formData.emergencyContact}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Appointment:</span>
                <span>${formData.opdSlot}</span>
              </div>
            </div>
          </div>

          <div class="department-severity">
            <div class="department-badge">
              ${departmentResponse.data.response.trim()}
            </div>
            <div class="severity-badge severity-${severityResponse.data.response.toLowerCase().trim()}">
              ${severityResponse.data.response.trim()}
            </div>
          </div>

          <h2 class="section-title">Vital Signs</h2>
          ${generateVitalSignsHtml(formData)}

          <h2 class="section-title">Reported Symptoms</h2>
          <div class="symptoms-list">
            ${Object.entries(formData.symptoms)
              .filter(([_, value]) => value)
              .map(([symptom]) => `
                <span class="symptom-tag">
                  ${symptom.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              `).join('')}
          </div>

          <h2 class="section-title">Medical History</h2>
          <div class="medical-history">
            <div class="history-item">
              <div class="history-label">Disease Type</div>
              <div>${formData.diseaseType || 'None specified'}</div>
            </div>
            <div class="history-item">
              <div class="history-label">Previous Records</div>
              <div>${formData.previousReport || 'No previous records'}</div>
            </div>
          </div>

          <h2 class="section-title">Analysis Details</h2>
          <div class="analysis-content">
            ${analysisResponse.data.response.split('\n').map(line => `<p>${line}</p>`).join('')}
          </div>
        </div>
      </body>
    </html>
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a new window for the analysis
      const newWindow = window.open('', '_blank');
      setAnalysisWindow(newWindow);

      // Make API calls
      const [departmentResponse, severityResponse, analysisResponse] = await Promise.all([
        axios.post('http://localhost:11434/api/generate', {
          model: 'llama3:8b',
          prompt: `Based on the following symptoms and vitals, determine the most appropriate department from this list (respond with ONE department name only):
            - Emergency Medicine (ER)
            - Cardiology
            - Neurology
            - Orthopedics
            - Pediatrics
            - Gynecology
            - Oncology
            - Urology
            - Gastroenterology
            - Nephrology
            - Pulmonology
            - Endocrinology
            - Dermatology
            - Ophthalmology
            - ENT
            - Psychiatry
            - Hematology
            - Rheumatology

            Patient Symptoms: ${Object.entries(formData.symptoms)
              .filter(([_, value]) => value)
              .map(([symptom]) => symptom.replace(/([A-Z])/g, ' $1').trim())
              .join(', ')}
            
            Vitals:
            BP: ${formData.bloodPressure}
            HR: ${formData.heart_rate}
            Temp: ${formData.temperature}°F
            
            Respond with department name only.`,
          stream: false
        }),
        
        axios.post('http://localhost:11434/api/generate', {
          model: 'llama3:8b',
          prompt: `Based on the following symptoms and vitals, determine severity level. 
            Choose ONE word from these options only:
            - Critical (life-threatening conditions requiring immediate attention)
            - Severe (serious conditions requiring urgent care)
            - Moderate (stable but significant conditions)
            - Mild (minor conditions, routine care)

            Patient Symptoms: ${Object.entries(formData.symptoms)
              .filter(([_, value]) => value)
              .map(([symptom]) => symptom.replace(/([A-Z])/g, ' $1').trim())
              .join(', ')}
            
            Vitals:
            BP: ${formData.bloodPressure}
            HR: ${formData.heart_rate}
            Temp: ${formData.temperature}°F
            
            Respond with one severity level only.`,
          stream: false
        }),
        
        axios.post('http://localhost:11434/api/generate', {
          model: 'llama3:8b',
          prompt: `Provide a concise medical analysis (max 40 words) with:
            1. Key Findings (2-3 bullet points)
            2. Immediate Actions (1-2 recommendations)
            3. Required Tests (1-2 most important)
            
            Patient Symptoms: ${Object.entries(formData.symptoms)
              .filter(([_, value]) => value)
              .map(([symptom]) => symptom.replace(/([A-Z])/g, ' $1').trim())
              .join(', ')}
            
            Vitals:
            BP: ${formData.bloodPressure}
            HR: ${formData.heart_rate}
            Temp: ${formData.temperature}°F`,
          stream: false
        })
      ]);

      newWindow.document.write(
        generateReportHtml(formData, departmentResponse, severityResponse, analysisResponse)
      );

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to generate analysis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Patient Registration</h2>
        <p>{currentDateTime.toLocaleString()}</p>
        <div className="token-display">Token #: {formData.tokenNumber}</div>
      </div>

      <div className="form-layout">
        <div className="form-main">
          <div className="step-navigation">
            {steps.map((step, index) => (
              <button
                key={step}
                className={`step-button ${currentStep === step ? 'active' : ''}`}
                onClick={() => setCurrentStep(step)}
              >
                {index + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === "personal" && (
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="input-group">
                  <label htmlFor="name">Patient Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age*</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="gender">Gender*</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="maritalStatus">Marital Status</label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="contactNumber">Contact Number*</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="emergencyContact">Emergency Contact*</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="address">Address*</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === "medical" && (
              <div className="form-section">
                <h3>Medical Information</h3>
                <div className="input-group">
                  <label htmlFor="bloodPressure">Blood Pressure</label>
                  <input
                    type="text"
                    id="bloodPressure"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="sugarLevel">Sugar Level</label>
                  <input
                    type="text"
                    id="sugarLevel"
                    name="sugarLevel"
                    value={formData.sugarLevel}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="heart_rate">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    id="heart_rate"
                    name="heart_rate"
                    value={formData.heart_rate}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="temperature">Temperature (°F)</label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="diseaseType">Disease Type</label>
                  <input
                    type="text"
                    id="diseaseType"
                    name="diseaseType"
                    value={formData.diseaseType}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group checkbox-group blood-sample-group">
                  <input
                    type="checkbox"
                    id="bloodSample"
                    name="bloodSample"
                    checked={formData.bloodSample || false}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        bloodSample: e.target.checked
                      }));
                    }}
                  />
                  <label htmlFor="bloodSample">Blood Sample Collected</label>
                </div>
                <div className="input-group">
                  <label htmlFor="previousReport">Previous Medical Records</label>
                  <textarea
                    id="previousReport"
                    name="previousReport"
                    value={formData.previousReport}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {currentStep === "symptoms" && (
              <div className="form-section">
                <h3>Symptoms</h3>
                <div className="symptoms-grid">
                  {Object.entries(symptomGroups).map(([groupName, symptoms]) => (
                    <div key={groupName} className="symptom-group">
                      <h4>{groupName}</h4>
                      <div className="symptom-items">
                        {symptoms.map(symptom => (
                          <div key={symptom} className="symptom-checkbox">
                            <input
                              type="checkbox"
                              id={symptom}
                              name={symptom}
                              checked={formData.symptoms[symptom]}
                              onChange={handleChange}
                            />
                            <label htmlFor={symptom}>
                              {symptom.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "appointment" && (
              <div className="form-section">
                <div className="appointment-container">
                  <div className="appointment-details">
                    <h3>Appointment Details</h3>
                    <div className="input-group">
                      <label htmlFor="opdSlot">OPD Appointment Slot*</label>
                      <select
                        id="opdSlot"
                        name="opdSlot"
                        value={formData.opdSlot}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select OPD Slot</option>
                        {opdSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="registration-summary">
                    <h3>Registration Summary</h3>
                    <div className="summary-content">
                      <div className="summary-item">
                        <span className="label">Patient Name:</span>
                        <span className="value">{formData.name || '-'}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Age/Gender:</span>
                        <span className="value">{formData.age || '-'} / {formData.gender || '-'}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Contact:</span>
                        <span className="value">{formData.contactNumber || '-'}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Appointment:</span>
                        <span className="value">{formData.opdSlot || '-'}</span>
                      </div>
                      <div className="summary-item token">
                        <span className="label">Token Number:</span>
                        <span className="value">#{formData.tokenNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="nav-buttons">
              <button
                type="button"
                className="back-btn"
                onClick={moveToPreviousStep}
                disabled={currentStep === steps[0]}
              >
                Previous
              </button>
              {currentStep !== steps[steps.length - 1] ? (
                <button
                  type="button"
                  className="next-btn"
                  onClick={moveToNextStep}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!validateStep(currentStep) || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;