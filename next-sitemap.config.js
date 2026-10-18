/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://simple9999.com',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: [
        '/dashboard',
        '/dashboard/*',
        '/editor/*',
        '/email-editor/*',
        '/login',
        '/signup',
        '/api/*',
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: ['/dashboard', '/editor', '/email-editor', '/api'] },
        ],
    },
};