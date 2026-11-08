import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
// 배포 후 실제 주소로 바꿔주세요 (canonical/OG 주소에 쓰입니다)
export default defineConfig({ site: 'https://gosari.pages.dev', integrations: [mdx()] });
