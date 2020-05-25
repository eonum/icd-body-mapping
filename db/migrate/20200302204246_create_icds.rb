class CreateIcds < ActiveRecord::Migration[6.0]
  def change
    create_table :icds do |t|
      t.string :code, null: false
      t.string :text_de, null: false
      t.string :text_fr, null: false
      t.string :text_it, null: false
    end
  end
end
