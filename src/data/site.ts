export const site = {
  name: "Saranga Kingkor Mahanta",
  shortName: "Saranga Mahanta",
  email: "saranga.mahanta7@gmail.com",
  social: {
    github: "https://github.com/Saranga7",
    linkedin: "https://www.linkedin.com/in/saranga-mahanta7",
    scholar: "https://scholar.google.com/citations?user=D2R6RJwAAAAJ",
    blog: "https://seventhinsight.wordpress.com",
    instagram: "https://www.instagram.com/mahanta_wanders/",
  },
} as const;

export const experience = [
  {
    role: "Doctoral Researcher",
    institution: "Sorbonne Université",
    location: "Paris, France",
    dates: "Feb. 2026 – Present",
    summary:
      "Applying computer vision and multimodal methods to interpret and restore Byzantine seals, in collaboration with historians.",
  },
  {
    role: "Research Engineer (CDD)",
    institution: "Institut de Biologie de l’École Normale Supérieure (IBENS)",
    location: "Paris, France",
    dates: "Jan. 2025 – Jan. 2026",
    summary:
      "Developed smartphone-embedded deep-learning models and an app for microscopic and sub-microscopic malaria detection.",
  },
  {
    role: "Research Intern · Master Thesis",
    institution: "Institut de Biologie de l’École Normale Supérieure (IBENS)",
    location: "Paris, France",
    dates: "Apr. 2024 – Oct. 2024",
    summary:
      "Proposed diffusion-model counterfactual explanations for interpreting classifier decisions on biological datasets.",
  },
  {
    role: "Google Summer of Code Contributor",
    institution: "ML4SCI",
    location: "Remote",
    dates: "May – Sep. 2023 · Jun. – Sep. 2022",
    summary:
      "Worked on regression, classification, anomaly detection, and dark-matter substructure analysis for DeepLense.",
  },
  {
    role: "Intern",
    institution: "DXOMARK",
    location: "Boulogne-Billancourt, France",
    dates: "Apr. 2023 – Jul. 2023",
    summary:
      "Stress-tested image-quality assessment models and built an automated evaluation pipeline.",
  },
  {
    role: "Research Intern",
    institution: "NIT Silchar · Aix-Marseille University",
    location: "Silchar, India · Marseille, France",
    dates: "Jul. 2021 – Sep. 2021",
    summary:
      "Developed textual-entailment methods for evaluating semantic consistency in abstractive summaries.",
  },
] as const;

export const education = [
  {
    institution: "Sorbonne Université, France",
    degree: "PhD in Computer Science (Machine Learning for Digital Humanities)",
    dates: "Feb. 2026 – Present",
  },
  {
    institution: "Institut Polytechnique de Paris, France",
    degree: "Master in Data and Artificial Intelligence",
    dates: "Sep. 2022 – Oct. 2024",
  },
  {
    institution: "National Institute of Technology Silchar, India",
    degree: "Bachelor of Technology in Electronics and Communication Engineering",
    dates: "Aug. 2018 – Jun. 2022",
  },
] as const;

interface WorkItem {
  title: string;
  label: string;
  text: string;
  href?: string;
}

export const moreWork: readonly WorkItem[] = [
  {
    title: "DiffEx",
    label: "Generative AI · Biomedical",
    text: "Diffusion-model counterfactual explanations for identifying microscopic cellular variations.",
    href: "https://arxiv.org/abs/2502.09663",
  },
  {
    title: "Text Summarization Evaluation",
    label: "Natural Language Processing",
    text: "Textual entailment as a measure of semantic consistency in abstractive summaries.",
    href: "https://www.sciencedirect.com/science/article/pii/S2949719123000250",
  },
  {
    title: "Neural Style Transfer",
    label: "Generative Vision · PyTorch",
    text: "Implemented neural style transfer from scratch in PyTorch and compared it with a pretrained TensorFlow Hub model.",
    href: "https://github.com/Saranga7/NST",
  },
  {
    title: "Sound Generation with VAEs",
    label: "Generative Audio · TensorFlow",
    text: "Trained vanilla and variational autoencoders on the Free Spoken Digit Dataset and studied their performance.",
    href: "https://github.com/Saranga7/sound-generation-VAE",
  },
  {
    title: "Facial Expression Recognition",
    label: "Computer Vision · CNN",
    text: "Built a CNN to classify five facial expressions and run real-time recognition through a webcam with OpenCV.",
    href: "https://github.com/Saranga7/Facial-Expression-Recognition",
  },
  {
    title: "Real-time Face Mask Detector",
    label: "Computer Vision · Transfer Learning",
    text: "Fine-tuned VGG19 to build a real-time face-mask detector using OpenCV and Keras/TensorFlow.",
    href: "https://github.com/Saranga7/covid19-face-mask-detectionr",
  },
  {
    title: "Colour Detection in Images",
    label: "Computer Vision · Clustering",
    text: "Used K-means clustering to identify dominant image colours and retrieve images using colour names.",
    href: "https://github.com/Saranga7/colour-identification",
  },
  {
    title: "Topic Extraction from Chats",
    label: "NLP · Topic Modelling",
    text: "Applied latent Dirichlet allocation to dialogue topics and generated day-wise WordClouds from WhatsApp chats.",
    href: "https://github.com/Saranga7/topic-modelling-wordcloud",
  },
  {
    title: "Citation Generator from URLs",
    label: "NLP · Web Scraping",
    text: "Built a system that extracts title, author, and year from webpages to generate Chicago-style reference strings.",
    href: "https://github.com/Saranga7/Devopedia-CMS_generator",
  },
  {
    title: "Spam & Random Text Classifier",
    label: "NLP · Flask",
    text: "Combined multinomial Naive Bayes with additional checks for gibberish and selected abusive language.",
    href: "https://github.com/Saranga7/spam_random_classifier",
  },
  {
    title: "Restaurant Delivery Prediction",
    label: "Regression · Ensemble Learning",
    text: "Combined multiple regression models through weighted averaging to predict restaurant delivery times.",
    href: "https://github.com/dasdebojit/Unnamed-Creator-Hackathon",
  },
  {
    title: "Bribery Cases Forecasting",
    label: "Time Series · SARIMA",
    text: "Built a SARIMA forecasting instance for bribery-case counts for a Smart India Hackathon project.",
    href: "https://github.com/utkarsh914/Xbribe/tree/master/ml_model/Forecast",
  },
] as const;

export const awards = [
  {
    year: "2022",
    title: "Charpak AME Scholarship",
    detail: "Full scholarship from the Embassy of France in India to pursue a Master’s degree in France.",
  },
  {
    year: "2021",
    title: "1st position · DiCOVA 2021 Challenge",
    detail: "Track 1: COVID-19 diagnosis from cough sound recordings.",
  },
  {
    year: "2020",
    title: "Finalist · National Crystal Ball Hackathon",
    detail: "Restaurant delivery-time prediction problem by Blue Yonder.",
  },
  {
    year: "2020",
    title: "Grand Finalist · Smart India Hackathon",
    detail: "Built a spam classifier, SARIMA forecasting instance, and chatbot for the main website.",
  },
] as const;

export const skills = {
  programming: ["Python", "C", "C++"],
  frameworks: ["PyTorch", "Flask", "Flutter"],
  tools: ["Git", "Hydra", "Weights & Biases", "HPC · SLURM"],
  interests: ["Computer Vision", "Multimodal Learning", "Generative Modeling", "Representation Learning"],
} as const;
