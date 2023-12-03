const { response, request } = require("express");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarios");

const usuariosGet = async (req, res = response) => {
  try {
      const usuarios = await Usuarios.find();
      res.json({
          msg: 'get API-controlador',
          usuarios,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          msg: 'Error al obtener los usuarios',
      });
  }
};

const usuariosPut = async (req, res = response) => {
    const { correo, ...datosActualizados } = req.body;

    try {
        // Verificar si se proporcionó una nueva contraseña y encriptarla
        if (datosActualizados.password) {
            datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
        }

        // Verificar si el usuario existe antes de intentar actualizarlo
        const usuarioExistente = await Usuarios.findOne({ correo: correo });

        if (!usuarioExistente) {
            return res.status(404).json({
                msg: 'Usuario no encontrado',
            });
        }

        // Actualizar el usuario
        const usuario = await Usuarios.findOneAndUpdate(
            { correo: correo },
            datosActualizados,
            { new: true }
        );

        res.json({
            msg: 'put API-controlador',
            usuario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en la actualización del usuario',
        });
    }
};




const usuariosPatch = async (req, res = response) => {
  const { correo, password, ...datosActualizados } = req.body;

  try {
      // Verificar si se proporcionó una nueva contraseña y encriptarla
      let hashedPassword;
      if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
      }

      // Actualizar el usuario por correo electrónico
      const usuario = await Usuarios.findOneAndUpdate(
          { correo: correo },
          {
              ...datosActualizados,
              ...(hashedPassword && { password: hashedPassword }),
          },
          { new: true }
      );

      if (!usuario) {
          return res.status(404).json({
              msg: 'Usuario no encontrado',
          });
      }

      res.json({
          msg: 'Patch API-controlador',
          usuario,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          msg: 'Error en la actualización del usuario',
      });
  }
};




const usuariosDelete = async (req, res = response) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuarios.findOneAndDelete({ correo: correo });

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado',
            });
        }

        res.json({
            msg: 'Usuario eliminado correctamente',
            usuario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el usuario',
        });
    }
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;

  try {
      // Verificar si ya existe un usuario con el mismo correo electrónico
      const existingUser = await Usuarios.findOne({ correo: correo });

      if (existingUser) {
          return res.status(400).json({
              msg: 'Ya existe un usuario con este correo electrónico',
          });
      }

      // Encriptar la contraseña antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, 10);

      const usuario = new Usuarios({
          nombre: nombre,
          correo: correo,
          password: hashedPassword,
          rol: rol,
      });

      await usuario.save();

      res.json({
          msg: 'post API-controlador, USUARIO AGREGADO CORRECTAMENTE',
          usuario,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          msg: 'Error al agregar el usuario',
      });
  }
};



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosPost,
};
