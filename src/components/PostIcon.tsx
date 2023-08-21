import { LucideProps, UserPlus } from "lucide-react";

export const PostIcon = {
    Logo : (props: LucideProps) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#000000" stroke-width="0.00032">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <title>
    </title>
    <g data-name="Play Button" id="Play_Button">
      <path fill="#8affb1" d="M22.58,13.41,11.52,6.91A3,3,0,0,0,7,9.5v13a3,3,0,0,0,1.51,2.61,3.08,3.08,0,0,0,1.49.4,3,3,0,0,0,1.52-.42l11.06-6.5a3,3,0,0,0,0-5.18Z">
      </path>
      <path fill="#e862f9" d="M7,16v6.5a3,3,0,0,0,1.51,2.61,3.08,3.08,0,0,0,1.49.4,3,3,0,0,0,1.52-.42l11.06-6.5A3,3,0,0,0,24.06,16Z">
      </path>
    </g>
  </g>
</svg>
    ),
    UserPlus
}

// typeとしても定義
export type PostIcon = keyof typeof PostIcon
