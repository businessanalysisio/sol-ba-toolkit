// Sol graph model.
//
// Two subgraphs that meet at Requirement:
//
//   (:WikiPage)-[:LINKS_TO]->(:WikiPage)          the LLM-Wiki, from [[wikilinks]]
//   (:Requirement)-[:SERVES]->(:Goal)             backward to the goal
//   (:Requirement)-[:VERIFIED_BY]->(:Test)        forward to the test
//   (:Requirement)-[:CITES]->(:WikiPage)          which page justified it
//
// The last edge is why the graph is worth having: it lets "which requirements
// depend on this page?" and "what breaks if this source is wrong?" be one hop
// instead of a scan. Everything here is derived — rebuildable by re-ingesting.

CREATE CONSTRAINT wiki_page_slug IF NOT EXISTS
  FOR (p:WikiPage) REQUIRE p.slug IS UNIQUE;

CREATE CONSTRAINT requirement_id IF NOT EXISTS
  FOR (r:Requirement) REQUIRE r.id IS UNIQUE;

CREATE CONSTRAINT goal_name IF NOT EXISTS
  FOR (g:Goal) REQUIRE g.name IS UNIQUE;

CREATE CONSTRAINT test_ref IF NOT EXISTS
  FOR (t:Test) REQUIRE t.ref IS UNIQUE;

CREATE INDEX wiki_page_type IF NOT EXISTS
  FOR (p:WikiPage) ON (p.type);

CREATE INDEX requirement_status IF NOT EXISTS
  FOR (r:Requirement) ON (r.status);

// --- Queries the app needs, kept here so the shape is reviewable ----------

// Backlinks for a wiki page (the reference's Backlinks panel):
//   MATCH (src:WikiPage)-[:LINKS_TO]->(p:WikiPage {slug: $slug}) RETURN src;

// Orphans — requirements with no goal:
//   MATCH (r:Requirement) WHERE NOT (r)-[:SERVES]->(:Goal) RETURN r;

// Gaps — requirements with no test:
//   MATCH (r:Requirement) WHERE NOT (r)-[:VERIFIED_BY]->(:Test) RETURN r;

// Blast radius of a source page — what depends on it, two hops out:
//   MATCH (p:WikiPage {slug: $slug})<-[:CITES]-(r:Requirement)-[:SERVES]->(g:Goal)
//   RETURN g.name, collect(r.title);
