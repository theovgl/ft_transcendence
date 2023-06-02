/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ['backend'],
		formats: ['image/webp'],
    	loader: 'default',
	  },
};

module.exports = nextConfig;
