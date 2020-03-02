json.extract! icd, :id, :code, :version, :text_de, :text_fr, :text_it, :created_at, :updated_at
json.url icd_url(icd, format: :json)
