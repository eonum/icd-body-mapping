class CreateLayers < ActiveRecord::Migration[6.0]
  def change
    create_table :layers do |t|
      t.string :ebene, null: false
      t.string :name, null: false
      t.string :img, null: false

      t.timestamps
    end
  end
end
