import { LucideProps, UserPlus } from "lucide-react";

export const Icons = {
    Logo : (props: LucideProps) => (
    <svg {...props} 
    viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <g transform="translate(5.796 8.927)">
        <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="-1183.897" y1="1855.346" x2="-1119.897" y2="1855.346" gradientTransform="matrix(0 1 1 0 -1829.142 1174.97)">
          <stop offset="0" stop-color="#00ea66"></stop>
          <stop offset="1" stop-color="#d600c4"></stop>
        </linearGradient>
        <path d="M58.204 6.073v34c0 8.284-6.716 15-15 15h-34c-8.284 0-15-6.716-15-15v-34c0-8.284 6.716-15 15-15h34c8.284 0 15 6.716 15 15z" fill="url(#a)"></path>
        <g transform="translate(-10.184 -993.295)">
          <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="-904.919" y1="1071.927" x2="-904.919" y2="1092.493" gradientTransform="matrix(.794 0 0 -.8101 754.868 1899.425)">
            <stop offset="0" stop-color="#50f1d1"></stop>
            <stop offset="1" stop-color="#ffffff"></stop>
          </linearGradient>
          <path d="M36.4 1001.368c-3.512 0-6.761.908-9.47 2.473-.459.265-.91.531-1.335.832-.41.292-.786.611-1.162.934-.014.011-.036.013-.05.025-3.076 2.637-4.995 6.271-4.995 10.294 0 3.965 1.874 7.541 4.872 10.167.014.107.024.223.024.303 0 2.322-1.786 4.214-4.055 4.239a9.41 9.41 0 0 0 3.61.731c2.19 0 4.163-.814 5.762-2.094a19.415 19.415 0 0 0 6.8 1.236c9.388 0 16.988-6.535 16.988-14.583s-7.601-14.557-16.989-14.557z" fill="url(#b)"></path>
        </g>
      </g>
    </g>
  </svg>
    ),
    UserPlus
}

// typeとしても定義
export type Icon = keyof typeof Icons
