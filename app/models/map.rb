class Map < ApplicationRecord
  validates_uniqueness_of   :layer_id, scope: :icd_id
  belongs_to :layer
end
