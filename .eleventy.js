module.exports = function(config) {
  config.addPassthroughCopy("_site/scripts")

  return {
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    dir: {
      input: "_site",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
      output: "dist",
    },
  };
};
