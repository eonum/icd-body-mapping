class CreateMaps < ActiveRecord::Migration[6.0]
  def change
    create_table :maps do |t|
      t.integer :icd_id
      t.integer :layer_id
    end
  end
end
