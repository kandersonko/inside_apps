export default class Item {
  static from(result) {
    let subtitle = "";
    if (
      result.attributes.tags &&
      result.attributes.tags.find((s) =>
        s.match(
          /\(?igc-ec\)?|idaho\s+geospatial\s+council\s+-\s+executive\s+committee\s+framework\s+layer/gi
        )
      )
    ) {
      subtitle = "Idaho Framework Layer";
    }
    // const thumbnailUrl = `https://www.arcgis.com/sharing/rest/content/items/${result.attributes.id}/info/${result.attributes.thumbnailUrl}`;
    const itemId = result.links.itemPage.split("=")[1];
    const thumbnailUrl = `https://www.arcgis.com/sharing/content/items/${itemId}/info/${result.attributes.thumbnailUrl}`;
    const authoritative =
      result.attributes.orgName === result.attributes.source;
    const description = result.attributes.searchDescription;
    const landingPage = result.links.self.replace("api/v3/", "");
    return {
      id: result.id,
      title: result.attributes.name,
      name: result.attributes.name,
      subtitle,
      owner: result.attributes.owner,
      type: result.attributes.type,
      snippet: description,
      description,
      thumbnailUrl,
      slug: result.attributes.slug,
      landingPage,
      url: result.attributes.url,
      org: result.attributes.organization,
      authoritative,
    };
  }
}
