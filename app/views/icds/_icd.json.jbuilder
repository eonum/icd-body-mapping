json.extract! icd, :id, :code, :version, :text_de, :text_fr, :text_it, :annotationen
json.url icd_url(icd, format: :json)
