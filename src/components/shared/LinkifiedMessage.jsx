/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";

export default function LinkifiedMessage({ content, sameSender }) {
  const renderContent = () => {
    const regex =
      /((https?:\/\/|www\.)[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    let result = [];
    let lastIndex = 0;

    for (const match of content.matchAll(regex)) {
      const matchText = match[0];
      const index = match.index;

      // Add plain text before the match
      if (index > lastIndex) {
        result.push(content.slice(lastIndex, index));
      }

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(matchText);
      const isLink = /(https?:\/\/|www\.)/.test(matchText);

      if (isEmail) {
        result.push(
          <a
            key={index}
            href={`mailto:${matchText}`}
            className={` ${
              sameSender
                ? "text-green-800 hover:text-green-900"
                : "text-green-600 hover:text-green-700"
            } underline `}
          >
            {matchText}
          </a>
        );
      } else if (isLink) {
        const href = matchText.startsWith("http")
          ? matchText
          : `https://${matchText}`;
        result.push(
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={` ${
              sameSender
                ? "text-blue-800  hover:text-blue-900"
                : "text-blue-600  hover:text-blue-800"
            } underline break-all`}
          >
            {matchText}
          </a>
        );
      }

      lastIndex = index + matchText.length;
    }

    // Add remaining plain text
    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex));
    }

    return result;
  };

  return (
    <Typography className="text-base break-words pt-1 leading-relaxed">
      {renderContent()}
    </Typography>
  );
}
//? Test Emails
// Type | Example
// Simple | test@example.com
// Dotted user | john.doe@mailserver.net
// Plus addressing | myemail+test@gmail.com
//? 🔗 Test Links (URLs)
// Type | Example
// Full URL | https://example.com
// HTTP URL | http://testsite.org/page
// No protocol | www.fakelink.io/resource
// With query | https://example.com/search?q=hello
// Subdomain | https://blog.example.com
// Port number | http://localhost:3000/test
// Path + anchor | https://docs.site.com/#section-3
// Long link | https://very.long.link.com/some/really/long/path/with-lots-of-stuff-in-it
