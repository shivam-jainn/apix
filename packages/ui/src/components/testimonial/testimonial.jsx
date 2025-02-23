import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "I've never seen anything like this before. It's amazing. I love it.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "I don't know what to say. I'm speechless. This is amazing.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "I'm at a loss for words. This is amazing. I love it.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "This is absolutely stunning! A game-changer for me.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "One of the best experiences I've had with a product like this.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "This is next-level innovation. I highly recommend it!",
        img: "https://avatar.vercel.sh/james",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
                // Dark theme styles
                "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full border border-gray-600" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-gray-400">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-gray-300">{body}</blockquote>
        </figure>
    );
};

export function Testimonial() {
    return (
        <>
            <section className="container mx-auto px-4 py-32 text-center bg-[#0d0c0c]">
                {/* Apply the font ONLY to the heading */}
                <h1 className={`text-5xl font-bold text-white mb-20`}>
                    Look What People Say About Us
                </h1>
                <div className="flex justify-center gap-4 mt-12">
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee pauseOnHover className="[--duration:20s]">
                            {firstRow.map((review) => (
                                <ReviewCard key={review.username} {...review} />
                            ))}
                        </Marquee>
                        <Marquee reverse pauseOnHover className="[--duration:20s]">
                            {secondRow.map((review) => (
                                <ReviewCard key={review.username} {...review} />
                            ))}
                        </Marquee>
                        {/* Fading gradient edges for a seamless effect */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0d0c0c] via-[#0d0c0c]/80 to-transparent"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0d0c0c] via-[#0d0c0c]/80 to-transparent"></div>
                    </div>
                </div>
            </section>
        </>
    );
}
