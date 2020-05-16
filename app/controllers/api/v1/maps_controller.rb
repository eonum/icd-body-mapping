class Api::V1::MapsController < ApplicationController
  def index
    render json: Map.all
  end

  def create
    map = Map.create(map_params)
    render json: map
  end

  def show
    map = Map.find(params[:id])
    render json: map
  end

  def show_icd
    map = Layer.joins(:maps).select("layers.*, maps.id as map_id, maps.icd_id").where("maps.icd_id = ?", params[:id])
    render json: map
  end

  def show_layer
    map = Layer.joins(:maps).select("layers.*, maps.icd_id").where("maps.icd_id = ? AND layers.ebene = ?", params[:id], params[:ebene])
    render json: map
  end

  def show_layers
    map = Layer.joins(:maps).select("layers.ebene, count(layers.ebene)").where("maps.icd_id = ?", params[:id]).group('layers.ebene').order(count: :desc)
    render json: map
  end

  def destroy
    Map.destroy(params[:id])
  end

  def update
    map = Map.find(params[:id])
    map.update_attributes(map_params)
    render json: map
  end

  private

  def map_params
    params.require(:map).permit(:id, :icd_id, :layer_id)
  end
end