'use client';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Boversal",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Comprehensive project management platform with task tracking, calendar, documents, and team collaboration features.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "Project Management",
      "Task Tracking", 
      "Kanban Boards",
      "Calendar Integration",
      "Meeting Scheduler",
      "Document Management",
      "Team Collaboration",
      "Time Tracking",
      "Pomodoro Timer"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
