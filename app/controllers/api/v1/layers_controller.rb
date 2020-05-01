class Api::V1::LayersController < ApplicationController

  def index
    render json: Layer.all.select('distinct(ebene)').order(ebene: :asc)
  end

  def show
    layers = Layer.all.where("LOWER(ebene)=LOWER(?)", params[:id])
    render :json => layers
  end

  def new
    @layer = Layer.new
  end

  def create
    layer = Layer.create(layer_params)
    render json: layer
  end

  def update
    layer = Layer.find(params[:id])
    layer.update_attributes(layer_params)
    render json: layer
  end

  def destroy
    Layer.destroy(params[:id])
  end

  private
    def layer_params
      params.require(:layer).permit(:ebene, :name, :img)
    end
end
