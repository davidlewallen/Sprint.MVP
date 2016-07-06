
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('repos', function(table) {
      table.integer('repo_id').primary();
      table.string('repo_name');
      table.string('username');
      table.integer('stargazers');
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('repos')  
  ])
};
