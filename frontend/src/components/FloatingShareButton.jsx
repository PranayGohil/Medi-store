import React, { useState } from "react";

const FloatingShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleShare = () => {
    setIsOpen(!isOpen);
  };

  // Get current page URL and title for sharing
  const currentUrl = window.location.href;
  const pageTitle = document.title || "Check out this amazing site!";
  const shareText = `${pageTitle} - ${currentUrl}`;

  // Social media share URLs
  const shareLinks = [
    {
      name: "WhatsApp",
      icon: "ri-whatsapp-line",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1ea952]",
    },
    {
      name: "Facebook",
      icon: "ri-facebook-fill",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0d5dbf]",
    },
    {
      name: "Twitter",
      icon: "ri-twitter-x-fill",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(pageTitle)}`,
      color: "bg-[#000000]",
      hoverColor: "hover:bg-[#333333]",
    },
    {
      name: "Instagram",
      icon: "ri-instagram-line",
      url: "https://www.instagram.com/",
      color: "bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4]",
      hoverColor: "hover:opacity-90",
      note: "Instagram doesn't support direct sharing",
    },
    {
      name: "LinkedIn",
      icon: "ri-linkedin-fill",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
      color: "bg-[#0A66C2]",
      hoverColor: "hover:bg-[#084d8f]",
    },
    {
      name: "Telegram",
      icon: "ri-telegram-fill",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(pageTitle)}`,
      color: "bg-[#0088cc]",
      hoverColor: "hover:bg-[#006699]",
    },
  ];

  const handleShare = (url, note) => {
    if (note) {
      window.open(url, "_blank", "noopener,noreferrer");
      alert(note + ". Please share manually.");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
          onClick={toggleShare}
        ></div>
      )}

      {/* Share Popup */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Popup Card */}
        {isOpen && (
          <div
            className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-5 w-[280px] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#3d4750] mb-1 font-Poppins">
                Contact Us
              </h3>
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {shareLinks.map((link, index) => (
                <button
                  key={link.name}
                  onClick={() => handleShare(link.url, link.note)}
                  className={`${link.color} ${link.hoverColor} w-full aspect-square rounded-xl flex flex-col items-center justify-center text-white transition-all duration-300 transform hover:scale-105 shadow-md`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                  }}
                  title={link.name}
                >
                  <i className={`${link.icon} text-[24px] mb-1`}></i>
                  <span className="text-[10px] font-medium">{link.name}</span>
                </button>
              ))}
            </div>
            
          </div>
        )}

        {/* Main Share Button */}
        <button
          onClick={toggleShare}
          className={`w-14 h-14 rounded-full bg-[#0097b2] hover:bg-[#007a8f] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform ${
            isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
          } hover:scale-110`}
          aria-label="Share"
        >
          {isOpen ? (
            <i className="ri-close-line text-[26px]"></i>
          ) : (
            <i className="ri-chat-3-fill text-[24px]"></i>
          )}
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .w-\[280px\] {
            width: calc(100vw - 100px);
            max-width: 280px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingShareButton;
