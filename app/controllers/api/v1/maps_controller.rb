class Api::V1::MapsController < ApplicationController
  def index
    render json: Map.all
  end

  def create
    maps = []
    params[:maps_list].each do |map_params|
      map = Map.new(select_permited(map_params))
      maps << ( map.save ? "OK" : map.errors )
    end if params[:maps_list]

    render json: maps
  end

  def show
    map = Map.find(params[:id])
    render json: map
  end

  def show_icd
    map = Layer.joins(:maps).select("layers.*, maps.id as map_id, maps.icd_id").where("maps.icd_id = ?", params[:id])
    render json: map
  end

  def destroy
    Map.destroy(params[:id])
  end

  private

  def select_permited(map_params)
    map_params.permit(:id, :icd_id, :layer_id)
  end
end