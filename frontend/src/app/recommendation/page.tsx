"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function RecommendationPage() {
  const [risk, setRisk] = useState("Low Risk");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [diseases, setDiseases] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState("");

  const diseaseOptions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Thyroid Disorder",
    "Asthma",
    "None",
  ];

  const handleDiseaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setDiseases(selected);
  };

  const generateRecommendation = () => {
    let rec = "";

    const ageNum = parseInt(age);

    if (risk === "High Risk") {
      rec += "⚠️ You are at high risk of metastasis. Please:\n";
      rec += "- Schedule monthly full-body PET-CT scans.\n";
      rec += "- Follow up with an oncologist every 2 weeks.\n";
      rec += "- Maintain a low-fat, anti-inflammatory diet.\n";
    } else if (risk === "Intermediate Risk") {
      rec += "⚠️ You are at intermediate risk. Suggested:\n";
      rec += "- Bi-monthly ultrasound and blood panel.\n";
      rec += "- Oncologist visits every 1-2 months.\n";
      rec += "- Limit stress and monitor hormonal balance.\n";
    } else {
      rec += "✅ You are at low risk. Suggested:\n";
      rec += "- Regular annual screening and physical checkups.\n";
      rec += "- Maintain a healthy lifestyle with exercise and nutrition.\n";
    }

    if (ageNum > 60) {
      rec += "- Due to age > 60, schedule cardiac evaluations every 6 months.\n";
    }

    if (bloodGroup === "AB-" || bloodGroup === "O-") {
      rec += "- Rare blood group detected: consider registering in a donor list for emergencies.\n";
    }

    if (diseases.includes("Diabetes")) {
      rec += "- Monitor glucose levels closely; cancer treatments can affect sugar regulation.\n";
    }
    if (diseases.includes("Heart Disease")) {
      rec += "- Keep a cardiologist involved; chemotherapy may affect cardiac function.\n";
    }
    if (diseases.includes("Asthma")) {
      rec += "- Avoid steroid-based therapies that can trigger asthma attacks.\n";
    }
    if (diseases.includes("Thyroid Disorder")) {
      rec += "- Monitor TSH levels every 2 months.\n";
    }
    if (diseases.includes("Hypertension")) {
      rec += "- Maintain BP < 130/80 during treatments.\n";
    }

    setRecommendation(rec);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a192f] text-white px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-green-400 mb-10">
          Personalized Patient Recommendation
        </h1>

        <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label className="block text-gray-300 mb-1">Metastasis Risk Level</label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            >
              <option>Low Risk</option>
              <option>Intermediate Risk</option>
              <option>High Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded"
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Previous Diseases</label>
            <select
              multiple
              value={diseases}
              onChange={handleDiseaseChange}
              className="w-full bg-gray-800 text-white p-2 rounded h-32"
            >
              {diseaseOptions.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-400 mt-1">
              (Hold Ctrl or Cmd to select multiple diseases)
            </p>
          </div>

          <button
            onClick={generateRecommendation}
            className="bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 w-full"
          >
            Generate Recommendation
          </button>

          {recommendation && (
            <div className="mt-6 bg-gray-800 p-6 rounded-lg text-sm whitespace-pre-line border border-green-600">
              <h2 className="text-2xl font-bold text-green-300 mb-3">
                Recommended Actions:
              </h2>
              <p className="text-gray-200">{recommendation}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
