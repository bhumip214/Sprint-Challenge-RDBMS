exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("projects")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("projects").insert([
        {
          name: "Lambda Sprint Challenge on RDBMS",
          description:
            "Build an application that lets users track Projects and Actions"
        }
      ]);
    });
};
