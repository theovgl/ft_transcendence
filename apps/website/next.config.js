/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ['backend', 'cdn.intra.42.fr'],
		formats: ['image/webp'],
		loader: 'default'
	},
};

module.exports = nextConfig;
