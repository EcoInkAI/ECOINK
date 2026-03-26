import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPageBySlug, getAllPageSlugs } from '@/lib/cms';
import PageRenderer from '@/components/PageRenderer';
import MetaHead from '@/components/seo/MetaHead';
import StructuredData from '@/components/seo/StructuredData';
import prisma from '@/lib/prisma';

interface PageProps {
    page: any;
    seoSettings?: any;
}

export default function DynamicPage({ page, seoSettings }: PageProps) {
    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
            </div>
        );
    }

    return (
        <>
            <MetaHead
                data={{
                    ...page,
                    metaRobots: !page.isPublished ? 'noindex, nofollow' : page.metaRobots
                }}
                settings={seoSettings}
            />
            <StructuredData data={page} type={page.schemaType || "WebPage"} />

            <main className="min-h-screen bg-white pb-24">
                {/* Render the dynamic sections from the CMS */}
                <PageRenderer content={page.content} />
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const pages = await getAllPageSlugs();

    // List of slugs that have dedicated static files in the pages directory
    const staticPages = [
        'index', 'contact', 'faq', 'why-magri-cabinets', 'get-a-custom-quote',
        'kitchen-cabinets', 'bathroom-vanities', 'wardrobes',
        'tv-cabinets', 'laundry-cabinets', 'furniture', 'projects', 'blogs',
        'ecoink-ads', 'ecoink-voice'
    ];

    const paths = pages
        .filter((p: any) => !staticPages.includes(p.slug))
        .map((p: any) => ({
            params: { slug: p.slug },
        }));

    // fallback: 'blocking' ensures new pages added to CMS are generated on first request
    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const slug = context.params?.slug as string;
    const preview = context.preview || false;
    const [page, seoSettings] = await Promise.all([
        getPageBySlug(slug, preview),
        prisma.seoSettings.findFirst({ where: { id: 1 } })
    ]);

    if (!page) {
        return {
            notFound: true,
            revalidate: 10,
        };
    }

    return {
        props: {
            page: JSON.parse(JSON.stringify(page)),
            seoSettings: JSON.parse(JSON.stringify(seoSettings)),
        },
        revalidate: 60,
    };
};

