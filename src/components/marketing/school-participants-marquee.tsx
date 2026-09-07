"use client";

import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import styles from "@/components/marketing/homepage.module.css";
import type { PublicSchoolParticipant } from "@/features/marketing/school-participants";
import { cn } from "@/lib/utils";

export function SchoolParticipantsMarquee({
  participants,
}: {
  participants: PublicSchoolParticipant[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewportRef, { amount: 0.2 });
  const reduced = useReducedMotion();

  return (
    <div
      ref={viewportRef}
      className={styles.schoolMarqueeViewport}
      data-active={Boolean(inView && !reduced)}
    >
      <div
        className={styles.schoolMarqueeTrack}
        style={{
          animationPlayState: inView && !reduced ? "running" : "paused",
        }}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className={cn(
              styles.schoolMarqueeGroup,
              copy === 1 && styles.schoolMarqueeDuplicate,
            )}
          >
            {participants.map((participant) => (
              <li key={`${copy}-${participant.name}`}>
                <a
                  href={participant.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.schoolMarqueeCard}
                  aria-label={
                    copy === 0
                      ? `Visit ${participant.name} official website`
                      : undefined
                  }
                  tabIndex={copy === 1 ? -1 : undefined}
                >
                  <span className={styles.schoolLogoFrame}>
                    <Image
                      src={participant.logoUrl}
                      alt=""
                      width={240}
                      height={88}
                      sizes="(max-width: 640px) 150px, 190px"
                      className={styles.schoolLogo}
                      data-dark-logo={participant.name.startsWith("Bellarmine")}
                    />
                  </span>
                  <span className={styles.schoolMarqueeName}>
                    {participant.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
