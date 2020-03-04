class AddAnnotationenToIcds < ActiveRecord::Migration[6.0]
  def change
    add_column :icds, :annotationen, :text
  end
end
