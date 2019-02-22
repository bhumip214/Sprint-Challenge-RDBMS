exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("actions")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("actions").insert([
        {
          description: "Frok and clone project",
          notes: "Use the repo link.",
          project_id: 1
        },
        {
          project_id: 1,
          description: "Install Dependencies",
          notes:
            "Remember to run npm init -y to generate a package.json before adding your dependencies."
        }
      ]);
    });
};
