class CreateLayers < ActiveRecord::Migration[6.0]
  def change
    create_table :layers do |t|
      t.string :ebene
      t.string :name
      t.string :img

      t.timestamps
    end
  end
end
