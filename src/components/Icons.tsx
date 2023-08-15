import { LucideProps, UserPlus } from "lucide-react";

export const Icons = {
    Logo : (props: LucideProps) => (
      <svg {...props} 
        viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0" />
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
        <g id="SVGRepo_iconCarrier">
          <path d="M896 192H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h576.6l191.6 127.7L896 832c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64z" fill="#3D5AFE" />
          <path d="M640 512c0-125.4-51.5-238.7-134.5-320H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h377.5c83-81.3 134.5-194.6 134.5-320z" fill="#536DFE" />
          <path d="M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" />
          <path d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" />
          <path d="M768 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" />
        </g>
    </svg>
    ),
    UserPlus
}

// typeとしても定義
export type Icon = keyof typeof Icons
