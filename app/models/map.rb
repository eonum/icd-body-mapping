class Map < ApplicationRecord
  validates_uniqueness_of   :layer_id, scope: :icd_id
  validates :icd_id, presence: true
  validates :layer_id, presence: true

  belongs_to :layer
  belongs_to :icd
end
