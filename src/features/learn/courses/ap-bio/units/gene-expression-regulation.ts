import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const geneExpressionRegulationLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "gene-expression-regulation",
    slug: "transcription-and-translation",
    title: "Transcription and translation",
    position: 11,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-1.C", "IST-1.N", "IST-1.O"],
    bodyPlain: [
      "Gene expression turns a DNA sequence into a functional product, usually a protein. Transcription copies a gene into RNA using complementary base pairing. RNA polymerase binds a promoter, reads the template strand, and builds an RNA transcript. In eukaryotes, that transcript is processed: a cap and tail are added, and introns are spliced out. The mature mRNA then leaves the nucleus.",
      "Translation reads mRNA in three-base codons. Transfer RNAs bring amino acids. A ribosome matches each codon to an anticodon and joins amino acids into a polypeptide. The genetic code is redundant: several codons can specify the same amino acid. It is also nearly universal, which is why a human gene can sometimes be expressed in bacteria. A silent substitution may not change the protein. A missense change swaps an amino acid. A nonsense change writes a stop too early.",
      "The information flow is directional in cells: DNA sequence specifies RNA sequence, which specifies amino-acid sequence. Cells do not translate protein sequence back into DNA as a routine information path. That is why a later chemical modification of a protein does not rewrite the gene, even if it changes function for a while.",
      "Club PCR and gel labs sit one step upstream of this story. Amplifying a fragment copies DNA. Seeing a band shows length, not the amino-acid sequence. To connect a gel to a phenotype, students still need the coding argument: this sequence, this RNA, this protein, this job. A band that is shorter than expected may mean a deletion or a splice change, not that 'the gene disappeared.'",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "gene-expression-regulation",
    slug: "gene-regulation-and-biotech-tools",
    title: "Gene regulation and biotech tools",
    position: 12,
    estimatedMinutes: 22,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-2.A", "IST-2.B", "IST-2.D", "IST-4.A"],
    bodyPlain: [
      "Not every gene is on in every cell at every time. Regulation decides whether transcription starts, how much RNA is made, how it is spliced, and whether the protein is kept or destroyed. In bacteria, operons let one switch control a set of related genes. A repressor bound to an operator can block polymerase. An inducer can release that repressor. The lac operon is the teaching case: lactose-related enzymes turn on when lactose is present and glucose is not the better fuel.",
      "Eukaryotic regulation is more layered. Transcription factors bind enhancers and promoters. Chromatin packing can hide or expose a gene. Alternative splicing can make different proteins from one gene. Small RNAs can silence transcripts. Cell specialization in a leaf versus a root is largely a regulation story: the genome is shared, the on-off pattern is not.",
      "Biotechnology tools let students and researchers read or rewrite pieces of this system. Restriction enzymes cut DNA at short recognition sites. Ligase joins fragments. Plasmids carry inserts into bacteria. Gel electrophoresis sorts fragments by size. PCR amplifies a chosen stretch. None of these tools creates meaning by itself. They are ways to copy, cut, and see sequence-length information.",
      "A peninsula biotech-club transformation plate that grows green colonies is showing that a plasmid entered cells and that a reporter gene was expressed, not that the bacteria 'became plants.' If the plate is blank, the failure could be the cut, the ligation, the heat shock, or the antibiotic selection. Trace the path from DNA fragment to protein product the same way you trace transcription and translation.",
    ].join("\n\n"),
  },
];
