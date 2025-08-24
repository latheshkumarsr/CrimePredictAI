# 🚔 Crime Pattern Analysis and Prediction using Machine Learning

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://python.org)
[![Machine Learning](https://img.shields.io/badge/ML-Classification%20%7C%20Clustering-green.svg)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

> *Empowering law enforcement with data-driven insights for proactive crime prevention*

## 🎯 Overview

In today's rapidly urbanizing world, crime remains a persistent challenge affecting community safety and development. This project leverages the power of machine learning to transform raw crime data into actionable insights, helping law enforcement agencies make informed decisions and allocate resources more effectively.

Our system analyzes historical crime patterns, identifies hotspots, and predicts future criminal activities with **88.6% accuracy** using ensemble methods, contributing to smarter policing strategies and enhanced public safety.

## ✨ Key Features

- **🔍 Crime Pattern Analysis**: Discover hidden trends and patterns in historical crime data
- **📍 Hotspot Detection**: Identify high-risk areas using K-Means clustering
- **🎯 Crime Type Prediction**: Multi-class classification with 88.6% accuracy
- **📊 Interactive Visualizations**: Comprehensive charts, heatmaps, and geographical plots
- **⚡ Real-time Predictions**: Input location and time to get crime probability scores
- **📈 Performance Metrics**: Detailed model comparison with precision, recall, and F1-scores

## 🛠️ Technology Stack

- **Programming Language**: Python 3.8+
- **Machine Learning**: Scikit-learn, NumPy
- **Data Processing**: Pandas
- **Visualization**: Matplotlib, Seaborn
- **Development Environment**: Jupyter Notebook
- **Version Control**: Git

## 🧠 Machine Learning Models

Our system implements and compares multiple algorithms:

| Algorithm | Accuracy | Precision | Recall | F1-Score |
|-----------|----------|-----------|--------|----------|
| **Random Forest** | **88.60%** | **0.87** | **0.88** | **0.87** |
| SVM (RBF Kernel) | 84.30% | 0.83 | 0.84 | 0.83 |
| Decision Tree | 81.25% | 0.78 | 0.80 | 0.79 |
| K-Nearest Neighbors | 79.10% | 0.77 | 0.78 | 0.77 |

*Random Forest emerged as the best-performing model, offering the optimal balance between accuracy and generalization.*

## 📊 Dataset

- **Source**: Publicly available crime datasets (Kaggle, government databases)
- **Features**: Crime type, location (lat/long), timestamp, district, severity
- **Size**: 8,000+ crime incidents
- **Preprocessing**: Missing value handling, categorical encoding, feature scaling

## 🚀 Getting Started

### Prerequisites

Python 3.8+
pip (Python package installer)

```bash
### Installation
1. **Clone the repository**
```
git clone https://github.com/latheshkumarsr/CrimePredictAI
cd crime-pattern-analysis

```bash
2. **Install required dependencies**
```
pip install -r requirements.txt
```bash
3. **Launch Jupyter Notebook**
```
jupyter notebook
```bash
4. **Run the main analysis**
```
python main.py
```bash
## 📁 Project Structure
```
crime-pattern-analysis/
│
├── data/
│ ├── raw/ # Original datasets
│ ├── processed/ # Cleaned datasets
│ └── results/ # Model outputs
│
├── notebooks/
│ ├── 01_data_exploration.ipynb
│ ├── 02_preprocessing.ipynb
│ ├── 03_model_training.ipynb
│ └── 04_visualization.ipynb
│
├── src/
│ ├── data_preprocessing.py
│ ├── model_training.py
│ ├── prediction.py
│ └── visualization.py
│
├── models/ # Saved trained models
├── reports/ # Generated reports and figures
├── requirements.txt
└── README.md
```bash
## 🔧 Usage Examples

### Basic Crime Prediction
```
from src.prediction import CrimePredictor

Initialize the predictor
predictor = CrimePredictor()

Load trained model
predictor.load_model('models/random_forest_model.pkl')

Make prediction
crime_probability = predictor.predict(
latitude=41.8781,
longitude=-87.6298,
hour=22,
month=7
)

print(f"Crime probability: {crime_probability:.2%}")

```bash
### Hotspot Analysis
```
from src.visualization import CrimeMapper

Create hotspot map
mapper = CrimeMapper()
mapper.plot_crime_hotspots(
data_path='data/processed/crime_data.csv',
clusters=5,
save_path='reports/hotspot_map.png'
)

## 📈 Results & Insights

### Key Findings

- **Temporal Patterns**: Crime rates peak during evening hours (8-11 PM) and weekends
- **Geographical Clusters**: Identified 5 major crime hotspots with distinct characteristics
- **Crime Types**: Theft and burglary account for 45% of all incidents
- **Seasonal Trends**: Summer months show 23% higher crime rates than winter

### Performance Highlights

- **Best Model**: Random Forest with 88.6% accuracy
- **Feature Importance**: Location coordinates and time are the strongest predictors
- **Generalization**: Model performs consistently across different geographic regions

## 🎯 Future Enhancements

- [ ] Real-time data integration with police databases
- [ ] Deep learning models for improved accuracy
- [ ] Mobile application for field officers
- [ ] Integration with surveillance systems
- [ ] Predictive resource allocation algorithms

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Crime Open Database** for providing publicly available datasets
- **Scikit-learn community** for excellent machine learning tools
- **Academic researchers** whose work inspired this project
- **Law enforcement agencies** for valuable domain insights


**⭐ Star this repository if you found it helpful!**

*This project aims to contribute to safer communities through data-driven insights and predictive analytics.*


