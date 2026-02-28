import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "Blog",
    "Zoo Labs Foundation",
    "Zoo Blog",
    "Decentralized AI",
    "DeAI Research",
    "DeSci",
    "Decentralized Science",
    "Open AI Research",
    "ZIPs Governance",
    "PoAI",
    "DSO",
    "Foundation Models",
    "Open Source AI",
    "AI Research",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "Zoo Labs Foundation",
            url: "https://zoo.ngo",
        },
    ],
    creator: "Zoo Labs Foundation",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@zoolabsfdn",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};
