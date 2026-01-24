import { Eta } from "@eta/eta";

const eta = new Eta({ views: `${Deno.cwd()}/views/` });

const pages = [
  { template: "index", output: "index.html", data: { title: "Home", name: "Kunal" } },
];

for (const page of pages) {
  const html = eta.render(page.template, page.data);
  await Deno.writeTextFile(page.output, html);
  console.log(`Generated ${page.output}`);
}