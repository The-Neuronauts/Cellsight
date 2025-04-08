"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { uploadImages } from "../utils/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import loadingAnimation from "../../../public/lottie/load.json";

// 👇 Fix: Dynamically import Lottie Player with SSR disabled
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function UploadPage() {
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [original1, setOriginal1] = useState<string | null>(null);
  const [original2, setOriginal2] = useState<string | null>(null);
  const [mask1, setMask1] = useState<string | null>(null);
  const [mask2, setMask2] = useState<string | null>(null);
  const [mitoticIndex, setMitoticIndex] = useState<number | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [metastasisRisk, setMetastasisRisk] = useState<string | null>(null);

  const [isCancerous, setIsCancerous] = useState<string>("No");
  const [inputMitoticIndex, setInputMitoticIndex] = useState<string>("");
  const [tumorSize, setTumorSize] = useState<string>("");
  const [tumorShape, setTumorShape] = useState<string>("Regular");

  const handleUpload = async () => {
    if (!selectedFile1 || !selectedFile2) {
      alert("Please select both images.");
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(async () => {
      const response = await uploadImages(selectedFile1, selectedFile2);
      setLoading(false);

      if (response.error) {
        setError(response.error);
      } else {
        setOriginal1(response.originalUrl1);
        setOriginal2(response.originalUrl2);
        setMask1(response.maskUrl1);
        setMask2(response.maskUrl2);
        setMitoticIndex(response.mitoticIndex);
        setClassification(response.classificationResult);
        setShowResults(true);
      }
    }, 4000);
  };

  const predictMetastasis = () => {
    const isCancer = isCancerous === "Yes";
    const index = parseFloat(inputMitoticIndex);
    const size = parseFloat(tumorSize);
    const isIrregular = tumorShape === "Irregular";

    let riskScore = 0;
    if (isCancer) riskScore++;
    if (index > 30) riskScore++;
    if (size > 2) riskScore++;
    if (isIrregular) riskScore++;

    if (riskScore >= 3) {
      setMetastasisRisk("High Risk");
    } else if (riskScore === 2) {
      setMetastasisRisk("Intermediate Risk");
    } else {
      setMetastasisRisk("Low Risk");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a192f] text-white px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-blue-500 mb-10">
          Upload Medical Images
        </h1>

        {!showResults && !loading && (
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-4 text-center">
              <label className="text-sm text-gray-300 mb-1 block">
                Histopathology Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="bg-gray-900 text-gray-400 p-2 rounded"
                onChange={(e) => setSelectedFile1(e.target.files?.[0] || null)}
              />
            </div>
            <div className="mb-4 text-center">
              <label className="text-sm text-gray-300 mb-1 block">
                Ultrasound Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="bg-gray-900 text-gray-400 p-2 rounded"
                onChange={(e) => setSelectedFile2(e.target.files?.[0] || null)}
              />
            </div>
            <button
              onClick={handleUpload}
              className="bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold transition hover:bg-blue-600 hover:scale-105"
            >
              Upload & Analyze
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center mt-10">
            <Player autoplay loop src={loadingAnimation} className="w-40 h-40" />
            <p className="text-lg font-semibold mt-2 text-gray-300">
              AI is working...
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-lg text-center mt-6">{error}</p>
        )}

        {showResults && (
          <div className="max-w-4xl mx-auto mt-10 bg-gray-900 p-8 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center border-b border-gray-700 pb-2">
              Diagnostic Report
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {[original1, mask1, original2, mask2].map((src, idx) => (
                <div key={idx} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    {["Original Image 1", "Mask Image 1", "Original Image 2", "Mask Image 2"][idx]}
                  </h3>
                  <img
                    src={src!}
                    alt={`Image ${idx + 1}`}
                    className="w-60 h-60 object-cover rounded-lg shadow-lg mx-auto border border-gray-600"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-green-400">Mitotic Index</h3>
              <p className="text-lg font-bold mt-2 text-gray-300">
                {mitoticIndex !== null ? `${mitoticIndex.toFixed(2)}%` : "Calculating..."}
              </p>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-yellow-400">Classification Result</h3>
              <p className="text-lg font-bold mt-2 text-gray-300">
                {classification || "Analyzing..."}
              </p>
            </div>

            <div className="text-center mt-8">
              <button
                className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
                onClick={() => setShowPredictionForm(true)}
              >
                Predict Metastasis
              </button>
            </div>

            {showPredictionForm && (
              <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-xl space-y-4">
                <h4 className="text-2xl font-semibold text-pink-400 text-center mb-4">Metastasis Risk Evaluation</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Is Image Cancerous?</label>
                    <select
                      className="w-full bg-gray-900 text-white p-2 rounded"
                      value={isCancerous}
                      onChange={(e) => setIsCancerous(e.target.value)}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Mitotic Index (%)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-900 text-white p-2 rounded"
                      value={inputMitoticIndex}
                      onChange={(e) => setInputMitoticIndex(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Tumor Size (cm)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-900 text-white p-2 rounded"
                      value={tumorSize}
                      onChange={(e) => setTumorSize(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Tumor Shape</label>
                    <select
                      className="w-full bg-gray-900 text-white p-2 rounded"
                      value={tumorShape}
                      onChange={(e) => setTumorShape(e.target.value)}
                    >
                      <option>Regular</option>
                      <option>Irregular</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={predictMetastasis}
                  className="bg-pink-600 mt-4 px-5 py-2 rounded-lg text-lg font-semibold hover:bg-pink-700 w-full"
                >
                  Get Risk Level
                </button>

                {metastasisRisk && (
                  <div className="mt-4 text-center">
                    <h3 className="text-2xl font-bold text-cyan-400">
                      Predicted Metastasis Risk:{" "}
                      <span className="text-white">{metastasisRisk}</span>
                    </h3>
                    <div className="col-span-2 text-center mt-6">
                      <a href="/recommendation">
                        <button className="bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
                          Get Patient Recommendation
                        </button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
