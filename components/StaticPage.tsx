import React from 'react';

interface StaticPageProps {
  pageKey: string;
}

const pageContent: Record<string, { title: string; content: React.ReactNode }> = {
  faq: {
    title: 'Frequently Asked Questions',
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">What is CineFlix?</h2>
          <p>CineFlix is a modern, open-source movie and TV show aggregator. It offers a seamless interface to browse trending, popular, and top-rated content from various sources, all in one place. Please note, CineFlix is a demonstration project and does not host any files on its server.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">How much does CineFlix cost?</h2>
          <p>CineFlix is completely free! There are no subscription fees or hidden costs. It's a portfolio project designed to showcase web development skills, using the free TMDb API to display content. The "Watch Now" buttons link to external, third-party services.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">What can I watch on CineFlix?</h2>
          <p>CineFlix has an extensive library of feature films, documentaries, and TV shows. Our platform uses The Movie Database (TMDb) API to fetch information on thousands of titles across numerous genres, ensuring you can always discover something new.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Where can I watch?</h2>
          <p>Watch anywhere, anytime. CineFlix is a fully responsive web application, which means you can enjoy it on your smartphone, tablet, laptop, or smart TV—any device with a modern web browser and an internet connection.</p>
        </div>
         <div>
          <h2 className="text-2xl font-bold mb-2">How do I use "My List"?</h2>
          <p>You can add a movie or TV show to your list by clicking the "My List" button on any title's page. This creates a personal watchlist for you to keep track of what you want to see. The list is stored locally in your browser, so it will be there when you return on the same device.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Is CineFlix safe for kids?</h2>
          <p>CineFlix includes a dedicated "Kids Movies" category to help you find family-friendly content. However, since this is a demonstration app, it does not include features like user profiles or parental controls. We recommend parental guidance when children are using the application.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Are there user accounts or subscriptions?</h2>
          <p>No. CineFlix is designed to be simple and accessible. There are no user accounts to create and no subscriptions to manage. Features like "My List" work without an account by using your browser's local storage.</p>
        </div>
      </div>
    ),
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: (
        <div className="space-y-4">
            <p>By using this CineFlix demonstration application, you agree that this is a non-commercial, educational project. You understand that the service does not host any media content and all streaming links are directed to third-party providers.</p>
            <p>You agree not to hold the creators of this application liable for any content found on external sites. All movie data, posters, and related metadata are provided by the TMDb API and are used for demonstrative purposes only.</p>
        </div>
    ),
  },
  'contact-us': {
    title: 'Contact Us',
    content: <p>This is a portfolio project, so direct contact is not provided through this page. To get in touch with the developer, please use the contact information available on their professional portfolio or social media profiles.</p>,
  },
  'about-us': {
    title: 'About CineFlix',
    content: (
      <div className="space-y-6">
        <p>Welcome to CineFlix, your ultimate destination for discovering and exploring movies and TV shows. Our mission is to provide a seamless and enjoyable experience for film and series enthusiasts everywhere.</p>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
          <p>In a world with an overwhelming amount of content spread across countless streaming services, finding what to watch next can be a challenge. CineFlix was created to solve this problem. We are an open-source aggregator that curates movies and TV shows from various platforms, presenting them in a clean, modern, and easy-to-navigate interface.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">What We Do</h2>
          <p>CineFlix is not a streaming service itself. We do not host or store any video files on our servers. Instead, we act as a smart, comprehensive guide. Our platform leverages the power of The Movie Database (TMDb) API to automatically fetch and display information about the latest and greatest in entertainment.</p>
           <ul className="list-disc list-inside mt-4 space-y-2">
              <li><strong>Discover:</strong> Browse trending, popular, and top-rated titles.</li>
              <li><strong>Explore:</strong> Dive deep into genres, cast and crew details, and find similar content.</li>
              <li><strong>Watch:</strong> We provide direct links to watch content on official third-party services.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Our Commitment</h2>
          <p>We are committed to providing a free, accessible, and legal way for everyone to enjoy the world of cinema. We respect intellectual property and strictly adhere to copyright laws, which is why we only link to legitimate sources.</p>
        </div>
        
        <p>Thank you for being a part of the CineFlix community. Happy watching!</p>
      </div>
    ),
  },
  'account': {
    title: 'Account',
    content: <p>This application does not have user accounts. Features like "My List" are saved directly to your browser's local storage. A full-fledged application would include user authentication, profiles, and personalized settings on this page.</p>,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: <p>Your privacy is important. This application does not collect any personal information. Your watchlist ("My List") and theme preference are stored locally on your device using your browser's local storage and are not transmitted to any server.</p>,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: (
        <div className="space-y-4">
            <p>This application uses `localStorage` in your browser to save your theme settings (light/dark mode) and your personal watchlist ('My List'). `localStorage` is a standard web technology that allows websites to store information on your computer.</p>
            <p>We do not use tracking cookies or any third-party analytics services. No personal data is collected or transmitted from your device. In a real-world application, this page would provide granular control over different types of cookies.</p>
        </div>
    ),
  },
  'legal': {
    title: 'Legal Notices',
    content: <p>All movie and TV show data, including posters, titles, and descriptions, are provided by The Movie Database (TMDb) API and are used under their terms of service for non-commercial purposes. This application is for demonstration only and is not affiliated with Netflix or TMDb.</p>,
  },
  'dmca': {
    title: 'DMCA Takedown Policy',
    content: (
        <div className="space-y-4">
            <p>CineFlix is a demonstration project and respects the intellectual property of others. We do not host any video files on our servers. All video links point to third-party content providers.</p>
            <p>If you are a copyright owner and believe that your copyrighted work has been used in a way that constitutes copyright infringement, please provide a written notice with the following information to our designated agent (note: this is a demo, so no agent is actively monitored):</p>
            <ul className="list-disc list-inside space-y-2">
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (e.g., the specific URL on a third-party site).</li>
                <li>Your contact information, including address, telephone number, and email address.</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
        </div>
    ),
  },
};

const StaticPage: React.FC<StaticPageProps> = ({ pageKey }) => {
  const page = pageContent[pageKey] || { title: 'Page Not Found', content: <p>The page you are looking for does not exist.</p> };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in min-h-[60vh]">
      <h1 className="text-3xl md:text-5xl font-bold font-display tracking-wide mb-8">{page.title}</h1>
      <div className="max-w-4xl text-gray-300 leading-relaxed text-lg">
        {page.content}
      </div>
    </div>
  );
};

export default StaticPage;