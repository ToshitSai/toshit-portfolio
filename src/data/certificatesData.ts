export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  year: string;
  image: string;
  credentialId?: string;
  credentialUrl?: string;
  description: string;
  aspectRatio?: string; // e.g. "16/10" or "4/3"
}

export const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "cert-01",
    title: "Agents and Workflows",
    issuer: "OpenAI Academy",
    date: "June 23, 2026",
    year: "2026",
    image: "/certificates/openai-agents-workflows.png",
    credentialId: "zqn9hhx224",
    credentialUrl: "https://academy.openai.com/public/certificate/zqn9hhx224",
    description: "Advanced certification covering multi-agent system architecture, autonomous workflow orchestration, and prompt engineering.",
    aspectRatio: "16/10",
  },
  {
    id: "cert-02",
    title: "AI Foundations",
    issuer: "OpenAI Academy",
    date: "June 21, 2026",
    year: "2026",
    image: "/certificates/openai-ai-foundations.png",
    credentialId: "av5pay9ybw",
    credentialUrl: "https://academy.openai.com/public/certificate/av5pay9ybw",
    description: "Comprehensive specialization in artificial intelligence fundamentals, neural network concepts, and LLM applications.",
    aspectRatio: "16/10",
  },
  {
    id: "cert-03",
    title: "Applied AI Foundations",
    issuer: "OpenAI Academy",
    date: "June 21, 2026",
    year: "2026",
    image: "/certificates/openai-applied-ai-foundations.png",
    credentialId: "4mie8ddvqy",
    credentialUrl: "https://academy.openai.com/public/certificate/4mie8ddvqy",
    description: "Practical mastery of deploying AI models, building production AI workflows, and integrating intelligent agent APIs.",
    aspectRatio: "16/10",
  },
  {
    id: "cert-04",
    title: "Build to Ship Hackathon 2026",
    issuer: "NxtWave",
    date: "August 6, 2026",
    year: "2026",
    image: "/certificates/nxtwave-build-to-ship-hackathon.jpg",
    description: "Certificate of Participation for showcasing technical expertise, creativity, and problem-solving by building a production-ready AI application.",
    aspectRatio: "4/3",
  },
  {
    id: "cert-05",
    title: "Base 44 Hackathon",
    issuer: "NxtWave & Base 44",
    date: "November 28, 2025",
    year: "2025",
    image: "/certificates/nxtwave-base44-hackathon.jpg",
    description: "Certificate of Participation awarded for developing an innovative application on the Base 44 platform with team 44-Hackers.",
    aspectRatio: "4/3",
  },
];
