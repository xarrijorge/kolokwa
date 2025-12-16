import Image from "next/image"

export default function FloatingPatterns({ scrollY }: { scrollY: number }) {
    return (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
                className="absolute top-[10%] left-[5%] animate-float"
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
                <Image src="/images/pattern-1.png" alt="" width={90} height={90} />
            </div>

            <div
                className="absolute top-[20%] right-[10%] animate-float-delayed"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
                <Image src="/images/pattern-2.png" alt="" width={100} height={100} />
            </div>

            <div
                className="absolute bottom-[25%] left-[15%] animate-float"
                style={{ transform: `translateY(${scrollY * 0.25}px)` }}
            >
                <Image src="/images/pattern-3.png" alt="" width={95} height={95} />
            </div>

            <div
                className="absolute top-[45%] right-[20%] animate-pulse-slow"
                style={{ transform: `translateY(${scrollY * 0.18}px)` }}
            >
                <Image src="/images/pattern-4.png" alt="" width={80} height={80} />
            </div>

            <div
                className="absolute bottom-[15%] right-[8%] animate-float-delayed"
                style={{ transform: `translateY(${scrollY * 0.22}px)` }}
            >
                <Image src="/images/pattern-5.png" alt="" width={90} height={90} />
            </div>
        </div>
    )
}