import { Eta } from "@bgub/eta";

const eta = new Eta({ views: `${Deno.cwd()}/src/views/`, defaultExtension: ".eta" });

const pages = [
  {
    template: "index",
    output: "index.html",
    data: {
      title: "Kunal Singh",
      name: "Kunal Singh",
      tagline: "Senior Software Engineer",
      github: "kunal-singh",
      linkedin: "kunal-singh",
      email: "hi@kunal-singh.com"
    }
  },
];

await Deno.mkdir("dist", { recursive: true });

for (const page of pages) {
  const html = eta.render(page.template, page.data);
  await Deno.writeTextFile(`dist/${page.output}`, html);
  console.log(`Generated dist/${page.output}`);
}