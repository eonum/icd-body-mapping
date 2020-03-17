class AddKapitelToIcds < ActiveRecord::Migration[6.0]
  def change
    add_column :icds, :kapitel, :smallint
  end
end
