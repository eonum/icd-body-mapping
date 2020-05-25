class AddCodeKapitelToIcds < ActiveRecord::Migration[6.0]
  def change
    add_column :icds, :code_kapitel, :string
    add_column :icds, :kapitel_name_de, :string
    add_column :icds, :kapitel_name_fr, :string
    add_column :icds, :kapitel_name_it, :string
    add_column :icds, :kapitel_roemisch, :string
  end
end
